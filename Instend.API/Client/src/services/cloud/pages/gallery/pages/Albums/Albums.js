import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/GalleryState';
import Album from '../../../../components/album/Album';
import { autorun } from 'mobx';
import { toJS } from 'mobx';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import { DeleteAlbums, UpdateAlbum } from '../../api/AlbumRequests';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';
import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';

const Albums = observer(() => {
    const wrapper = useRef();
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeItems, setActiveItems] = useState([]);
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);
    const [items, setItems] = useState(Object.values(toJS(galleryState.albums)).flat());

    const single = [
        [null, "Edit", () => {
            setCreateAlbumOpen(true);
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
        galleryState.GetAlbums();
    }, []);

    useEffect(() => {
        const disposer = autorun(() => {
          setItems(Object.values(toJS(galleryState.albums)).flat());
        });
    
        return () => disposer();
    }, [galleryState, galleryState.albums]);

    return (
        <>        
            <AddInGallery id={null} />
            {isCreateAlbumOpen && activeItems[0] && <CreateAlbum 
                isOpen={isCreateAlbumOpen}
                closeCallback={() => {setCreateAlbumOpen(false)}}
                isUpdate={true}
                nameValue={activeItems[0].name}
                descriptionValue={activeItems[0].description}
                cover={activeItems[0].cover}
                title={'Edit album'}
                callback={(name, description, image) => {
                    UpdateAlbum(name, description, image, activeItems[0].id);
                    setCreateAlbumOpen(false);
                }}
            />}
            <div className={styles.content} ref={wrapper}>
                {Object.values(galleryState.albums).filter(element => element.typeId === 'Album').map(value => {
                        return (
                            <Album 
                                key={value.id} 
                                album={value}
                                isSelected={selectedItems[0] ? selectedItems.map(element => element.id).includes(value.id) : null}
                            />
                        )
                    })
                }
            </div>
            <SelectBox
                selectPlace={[wrapper]}
                selectedItems={[selectedItems, setSelectedItems]}
                activeItems={[activeItems, setActiveItems]}
                itemsWrapper={wrapper}
                items={items}
                single={single}
                multiple={multiple}
            />
        </>
    );
});

export default Albums;