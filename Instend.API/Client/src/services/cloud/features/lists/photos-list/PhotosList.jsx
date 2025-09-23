import { useState } from 'react';
import styles from './main.module.css';
import Preview from '../../../../preview/layout/Preview';
import StorageController from '../../../../../api/StorageController';
import ContextMenu from '../../../shared/context-menus/context-menu/ContextMenu';
import FetchItemsWithPlaceholder from '../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';

const PhotosList = ({ isHasMore = true, callback = () => {}, photos = [], contextMenuItems = [] }) => {
    const [index, setIndex] = useState(0);
    const [isPreviewOpen, setPreviewOpenState] = useState(false);

    return (
        <div className={styles.photos}>
            {isPreviewOpen && 
                <Preview
                    close={() => setPreviewOpenState(false)}
                    index={index}
                    files={photos}
                />}
                {photos
                    // .sort((a, b) => SortingHandler.CompareTwoDates(a.creationTime, b.creationTime, true))
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
                <FetchItemsWithPlaceholder
                    item={
                        <div></div>
                    }
                    isHasMore={isHasMore}
                    callback={callback}
                />
        </div>
    );
};

export default PhotosList;