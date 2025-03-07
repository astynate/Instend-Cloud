import { useState } from 'react';
import SortingHandler from '../../../../../handlers/SortingHandler';
import styles from './main.module.css';
import Preview from '../../../../preview/layout/Preview';
import StorageController from '../../../../../api/StorageController';
import ContextMenu from '../../../shared/context-menus/context-menu/ContextMenu';

const PhotosList = ({ photos = [], contextMenuItems = [] }) => {
    const [index, setIndex] = useState(0);
    const [isPreviewOpen, setPreviewOpenState] = useState(false);

    if (!photos || !photos.length) {
        return null;
    };

    return (
        <div className={styles.photos}>
            {isPreviewOpen && 
                <Preview
                    close={() => setPreviewOpenState(false)}
                    index={index}
                    files={photos}
                />}
                {photos
                .sort((a, b) => SortingHandler.CompareTwoDates(a.creationTime, b.creationTime))
                .map((photo, index) => {
                    return (
                    <ContextMenu 
                        key={photo.id + index}
                        items={contextMenuItems.map(item => ({
                        ...item,
                        callback: () => item.callback(photo)
                        }))}
                    >
                        <div 
                            className={styles.photo} 
                            onClick={() => {
                                setIndex(index);
                                setPreviewOpenState(true);
                            }}
                        >
                            <img src={StorageController.getFullFileURL(photo.path)} draggable="false" />
                        </div>
                    </ContextMenu>
                    )
                })}
        </div>
    );
};

export default PhotosList;