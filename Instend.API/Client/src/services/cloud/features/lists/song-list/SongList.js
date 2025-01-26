import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { instance } from '../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../../utils/helpers/DownloadFromResponseHelper';
import { Delete } from '../../pages/cloud/api/FolderRequests';
import styles from './main.module.css';
import Song from '../../pages/music/shared/song/Song';
import musicState from '../../../../states/music-state';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import EditSong from '../../features/edit-song-pop-up-window/EditSongPopUpWindow';
import applicationState from '../../../../states/application-state';

const SongList = observer(({songs, isHeaderless, isMobile, isHasIndex = true, setSelectedFiles}) => {
    const [activeItems, setActiveItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);
    const songWrapper = useRef();

    // const single = [
    //     [null, "Edit", () => {setCreateAlbumOpen(true)}],
    //     [null, "Download", async () => {
    //         setActiveItems(prev => {
    //             if (prev[0] && prev[0].id) {
    //                 (async () => {
    //                     await instance
    //                         .get(`/file/download?id=${prev[0].id}`, {
    //                             responseType: "blob"
    //                         })
    //                         .then((response) => {
    //                             DownloadFromResponse(response);
    //                         })
    //                         .catch((error) => {
    //                             console.error(error);
    //                         });
    //                 })();
    //             }

    //             return prev;
    //         });
    //     }],
    //     [null, "Delete", () => {
    //         setActiveItems(prev => {
    //             Delete(prev);  
    //             return prev;
    //         })
    //     }]
    // ]
    
    // const multiple = [
    //     [null, "Delete", () => {
    //         setActiveItems(prev => {
    //             Delete(prev);
    //             return prev;
    //         })
    //     }]
    // ]

    return (
        <div className={styles.songList}>

            <div className={styles.songs} ref={songWrapper}>
                {/* {songs && songs.map && songs.map((element, index) => {
                    return (
                        <Song 
                            key={index}
                            index={applicationState.isMobile ? null : isHasIndex ? index + 1 : null}
                            song={element}
                            isSelect={selectedItems.map(x => x.id).includes(element.id)}
                            isPlaying={element.id === musicState.GetCurrentSongId() && musicState.isPlaying}
                            setQueue={() => musicState.SetSongQueue(songs)}
                            isShort={isMobile}
                            setSelectedFiles={setSelectedFiles}
                        />
                    )
                })} */}
            </div>
            {/* <SelectBox 
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
            />} */}
        </div>
    )
});

export default SongList;