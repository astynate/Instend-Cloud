import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import styles from './main.module.css';
import StorageState from '../../../../../../state/entities/StorageState';
import GlobalContext from '../../../../../../global/GlobalContext';
import StorageController from '../../../../../../api/StorageController';
import FilesController from '../../../../api/FilesController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import SortingHandler from '../../../../../../utils/handlers/SortingHandler';
import Preview from '../../../../../preview/layout/Preview';

const Photos = observer(({}) => {
    const [index, setIndex] = useState(0);
    const [isPreviewOpen, setPreviewOpenState] = useState(false);

    let photos = StorageState
        .GetSelectionByType(GlobalContext.supportedImageTypes);

    useEffect(() => {
        FilesController.GetLastFilesWithType(
            5, 
            photos.length, 
            'gallery',
            StorageState.OnGetFilesByTypeSuccess
        );
    }, [photos.length]);

    return (
        <ContentWrapper>
            {isPreviewOpen && 
                <Preview
                    close={() => setPreviewOpenState(false)}
                    index={index}
                    files={photos}
                />}
            <div className={styles.photos}>
                {photos && photos.length && photos
                    .sort((a, b) => SortingHandler.CompareTwoDates(a.creationTime, b.creationTime))
                    .map((photo, index) => {
                        return (
                            <div 
                                className={styles.photo} 
                                key={photo.id}
                                onClick={() => {
                                    setIndex(index);
                                    setPreviewOpenState(true);
                                }}
                            >
                                <img src={StorageController.getFullFileURL(photo.path)} draggable="false" />
                            </div>
                        )
                    })}
            </div>
        </ContentWrapper>
    );
});

export default Photos;