import React, { useContext, useEffect, useState } from 'react';
import styles from './main.module.css';
import Preview from '../../../../../preview/layout/Preview';
import { LayoutContext } from '../../../../layout/Layout';
import ContextMenu from '../../../../shared/context-menu/ContextMenu';
import { instance } from '../../../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../../../utils/DownloadFromResponse';

const PhotoList = (props) => {
    const {ErrorMessage} = useContext(LayoutContext)
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(auto-fill, minmax(200px, 1fr))');
    const [columnCount, setColumnCount] = useState(null);
    const [isContextMenuOpen, setContextMenuState] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isPreview, setPreviewState] = useState(false);

    useEffect(() => {
        if (props.photoGrid === 'grid') {
            setGridTemplateColumns(`repeat(auto-fill, minmax(${100 + 25 * props.scale}px, 1fr))`);
            setColumnCount(null);
        } else if (props.photoGrid === 'waterfall') {
            setGridTemplateColumns(null);
            setColumnCount(8 - props.scale);
        }
    
    }, [props.scale, props.photoGrid]);

    return (
        <div>
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
            <div className={styles.photos} id={props.photoGrid} style={{ gridTemplateColumns, columnCount }} ref={props.forwardRef}>
                {props.photos && props.photos.map && props.photos.map((element, index) => {
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
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    );
 };

export default PhotoList;