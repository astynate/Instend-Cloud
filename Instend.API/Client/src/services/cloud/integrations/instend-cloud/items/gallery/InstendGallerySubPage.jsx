import { useRef } from 'react';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import PhotoList from '../../../../pages/gallery/shared/photo-list/PhotoList';
import styles from './main.module.css';
import Scroll from '../../../../widgets/scroll/Scroll';
import { observer } from 'mobx-react-lite';

const InstendGallerySubPage = observer(({setSelectedFiles, wrapper}) => {
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
                setSelectedFiles={setSelectedFiles}
            />
            <Scroll
                scroll={[wrapper]}
                isHasMore={storageState.hasMorePhotos}
                count={storageState.countPhotos}
                callback={() => {
                    storageState.GetItems();
                }}
            />
        </div>
    );
});

export default InstendGallerySubPage;