import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PlayListPreview from '../../widgets/playlist-preview/PlayListPreview';
import AddInMusic from '../../widgets/add-in-music/AddInMusic';
import galleryState from '../../../../../../states/gallery-state';
import { ConvertDate, ConvertFullDate } from '../../../../../../utils/DateHandler';
import { observer } from 'mobx-react-lite';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import { autorun } from 'mobx';
import { DeleteAlbums, UpdateAlbum } from '../../../gallery/api/AlbumRequests';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';

const Playlists = observer(() => {
    const wrapper = useRef();
    const [isUpdatPlaylistState, setPlaylistState] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeItems, setActiveItems] = useState([]);
    const [playlists, setPlaylists] = useState(Object.values(galleryState.albums)
        .filter(element => element.typeId === 'Playlist'));

    const single = [
        [null, "Edit", () => {
            setPlaylistState(true);
        }],
        [null, "Delete", () => {
            setActiveItems(prev => {
                DeleteAlbums(prev);
                return prev;
            })
        }]
    ]

    const multiple = [
        [null, "Delete", () => {
            setActiveItems(prev => {
                DeleteAlbums(prev);
                return prev;
            })
        }]
    ]

    useEffect(() => {        
        galleryState.GetPlaylists();
    }, []);

    useEffect(() => {
        const disposer = autorun(() => {
            setPlaylists(Object.values(galleryState.albums)
                .filter(element => element.typeId === 'Playlist'));
        });
    
        return () => disposer();
    }, [galleryState, galleryState.albums]);

    return (
        <div className={styles.content} ref={wrapper}>
            <AddInMusic />
            {playlists.map((element, index) => {
                    return (
                        <PlayListPreview 
                            key={index}
                            id={element.id}
                            name={element.name}
                            cover={element.cover}
                            time={ConvertDate(element.lastEditTime)}
                            isSelected={selectedItems[0] ? selectedItems.map(element => element.id).includes(element.id) : null}
                        />
                    )
                })
            }
            <SelectBox
                selectPlace={[wrapper]}
                selectedItems={[selectedItems, setSelectedItems]}
                activeItems={[activeItems, setActiveItems]}
                itemsWrapper={wrapper}
                items={playlists}
                single={single}
                multiple={multiple}
            />
            {isUpdatPlaylistState && activeItems[0] && <CreateAlbum 
                isOpen={isUpdatPlaylistState}
                closeCallback={() => {setPlaylistState(false)}}
                isUpdate={true}
                nameValue={activeItems[0].name}
                descriptionValue={activeItems[0].description}
                cover={activeItems[0].cover}
                title={'Edit playlist'}
                callback={(name, description, image) => {
                    UpdateAlbum(name, description, image, activeItems[0].id);
                    setPlaylistState(false);
                }}
            />}
        </div>
    );
});

export default Playlists;