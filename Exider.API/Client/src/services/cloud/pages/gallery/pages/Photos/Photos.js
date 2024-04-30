import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Information from '../../../../shared/information/Information';
import Sroll from '../../../../widgets/sroll/Scroll';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import { CalculateAverageEqual } from '../../../../widgets/item-list/ItemList';
import ContextMenu from '../../../../shared/context-menu/ContextMenu';
import Preview from '../../../../../preview/layout/Preview';
import { GetPhotoById } from '../../layout/Gallery';
import { instance } from '../../../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../../../utils/DownloadFromResponse';

const Photos = observer((props) => {
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(auto-fill, minmax(200px, 1fr))');
    const [columnCount, setColumnCount] = useState(null);
    const [objectFit, setObjectFit] = useState(props.objectFit);
    const [isContextMenuOpen, setContextMenuState] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isPreview, setPreviewState] = useState(false);
    const photosWrapper = useRef();
    
    const changeDate = () => {
        try {
            const element = photosWrapper.current;
            let children = Array.from(element.children);
            
            children = children.filter((item) => {
                let rect = item.getBoundingClientRect(); 
                return CalculateAverageEqual(rect.top, props.dataRef.current.offsetTop, 60);
            });
    
            if (children.length > 0) {
                props.setCurrent(children.map(e => e.id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        props.scroll.current.addEventListener('scroll', changeDate);
      
        return () => {
          try {
            props.scroll.current.removeEventListener('scroll', changeDate);
          } catch {}
        };
    }, []);  

    useEffect(() => {
        if (props.photoGrid === 'grid') {
            setGridTemplateColumns(`repeat(auto-fill, minmax(${100 + 25 * props.scale}px, 1fr))`);
            setColumnCount(null);
        } else if (props.photoGrid === 'waterfall') {
            setGridTemplateColumns(null);
            setColumnCount(8 - props.scale);
        }
    
    }, [props.scale, props.photoGrid]);

    const ErrorMessage = (title, message) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setErrorState(true);
    }

    useEffect(() => {
        setObjectFit(props.objectFit);
    }, [props.objectFit]);

    return (
        <>
            <Information
                open={isError}
                close={() => setErrorState(false)}
                title={errorTitle}
                message={errorMessage}
            />
            {isPreview && 
                <Preview
                    close={() => setPreviewState(false)} 
                    file={selectedItems[0]}
                    ErrorMessage={ErrorMessage}
            />}
            {isContextMenuOpen &&
                <ContextMenu 
                items={[
                    [null, "Open", () => {setPreviewState(true)}],
                    [null, "Add to album", () => {}],
                    [null, "Share", () => {}],
                    [null, "Download", async () => {
                        await instance
                            .get(`/file/download?id=${selectedItems[0].id}`, {
                                responseType: "blob"
                            })
                            .then((response) => {
                                DownloadFromResponse(response);
                            })
                            .catch((error) => {
                                console.error(error);
                                ErrorMessage('Attention!', 'Something went wrong');
                            });
                    }],
                    [null, "Delete", () => {}]
                ]} 
                close={() => setContextMenuState(false)}
                isContextMenu={true}
                position={contextMenuPosition}
            />}
            <div className={styles.photos} id={props.photoGrid} style={{ gridTemplateColumns, columnCount }} ref={photosWrapper}>
                {galleryState.photos.map((element, index) => {
                    return (
                        <div 
                            key={index} 
                            className={styles.photoWrapper} 
                            id={element.id}
                            onContextMenu={async (event) => {
                                event.preventDefault();
                                setContextMenuState(true);
                                setContextMenuPosition([event.clientX, event.clientY]);
                                setSelectedItems([element]);
                            }}
                        >
                            <img 
                                src={`data:image/png;base64,${element.fileAsBytes}`}
                                draggable="false"
                                style={{objectFit}}
                                id={objectFit === 'contain' ? 'contain' : null}
                            />
                        </div>
                    )
                })}
            </div>
            <Sroll 
                scroll={props.scroll}
                isHasMore={galleryState.hasMore}
                array={galleryState.photos}
                callback={() => {
                    galleryState.GetPhotos();
                }}
            />
        </>
    );
});

export default Photos;