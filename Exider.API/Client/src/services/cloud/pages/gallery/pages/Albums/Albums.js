import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import Album from '../../widgets/album/Album';
import Add from '../../widgets/add/Add';
import { autorun } from 'mobx';
import { toJS } from 'mobx';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import { DeleteAlbums } from '../../api/AlbumRequests';

const Albums = observer(() => {
    const wrapper = useRef();
    const [selectedItems, setSelectedItems] = useState([]);
    const [activeItems, setActiveItems] = useState([]);
    const [items, setItems] = useState(Object.values(toJS(galleryState.albums)).flat());

    const single = [
        [null, "Rename", () => {}],
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
            <Add id={null} />
            <div className={styles.content} ref={wrapper}>
                {Object.entries(galleryState.albums).map(([key, value]) => {
                        return (
                            <Album 
                                key={key} 
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