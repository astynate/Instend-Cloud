import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Song from '../../shared/song/Song';
import musicState from '../../../../../../states/music-state';
import { observer } from 'mobx-react-lite';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import { instance } from '../../../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../../../utils/DownloadFromResponse';
import { Delete } from '../../../cloud/api/FolderRequests';
import EditSong from '../../features/edit-song/EditSong';

const SongList = observer(({songs, isHeaderless}) => {
    const [activeItems, setActiveItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);
    const songWrapper = useRef();

    const single = [
        [null, "Edit", () => {setCreateAlbumOpen(true)}],
        [null, "Download", async () => {
            setActiveItems(prev => {
                if (prev[0] && prev[0].id) {
                    (async () => {
                        await instance
                            .get(`/file/download?id=${prev[0].id}`, {
                                responseType: "blob"
                            })
                            .then((response) => {
                                DownloadFromResponse(response);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    })();
                }

                return prev;
            });
        }],
        [null, "Delete", () => {
            setActiveItems(prev => {
                Delete(prev);  
                return prev;
            })
        }]
    ]
    
    const multiple = [
        [null, "Delete", () => {
            setActiveItems(prev => {
                Delete(prev);
                return prev;
            })
        }]
    ]

    return (
        <div className={styles.songList}>
            {!isHeaderless && <div className={styles.songListHeader}>
                <div className={styles.name}>
                    <span className={styles.item}>#</span>
                    <span className={styles.item}>Name</span>
                </div>
                <span className={styles.item}>Album</span>
                <span className={styles.item}>Plays</span>
                <span className={styles.item}>Time</span>
            </div>}
            <div className={styles.songs} ref={songWrapper}>
                {songs && songs.map && songs.map((element, index) => {
                    return (
                        <Song 
                            key={index}
                            index={index + 1}
                            song={element}
                            isSelect={selectedItems.map(x => x.id).includes(element.id)}
                            isPlaying={element.id === musicState.GetCurrentSongId() && musicState.isPlaying}
                            setQueue={() => musicState.SetSongQueue(songs)}
                        />
                    )
                })}
            </div>
            <SelectBox 
                selectPlace={[songWrapper]}
                selectedItems={[selectedItems, setSelectedItems]}
                activeItems={[activeItems, setActiveItems]}
                itemsWrapper={songWrapper}
                items={songs}
                single={single}
                multiple={multiple}
            />
            {isCreateAlbumOpen && <EditSong 
                open={isCreateAlbumOpen}
                close={() => {setCreateAlbumOpen(false)}}
                song={activeItems[0]}
            />}
        </div>
    )
});

export default SongList;