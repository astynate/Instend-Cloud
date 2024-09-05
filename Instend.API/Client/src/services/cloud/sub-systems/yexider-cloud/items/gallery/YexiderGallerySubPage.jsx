import { useRef } from 'react';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import PhotoList from '../../../../pages/gallery/shared/photo-list/PhotoList';
import styles from './main.module.css';

const YexiderGallerySubPage = () => {
    const photosWrapper = useRef();

    let photos = storageState
        .GetSelectionByType([...FileAPI.videoTypes, ...FileAPI.imageTypes]);

    return (
        <div className={styles.wrapper} ref={photosWrapper}>
            <PhotoList
                photos={photos} 
                scale={1}
                photoGrid={[]}
                forwardRef={photosWrapper}
            />
        </div>
    );
}

export default YexiderGallerySubPage;