import { observer } from 'mobx-react-lite';
import StorageState from '../../../../../../state/entities/StorageState';
import GlobalContext from '../../../../../../global/GlobalContext';
import FilesController from '../../../../api/FilesController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';
import PhotosList from '../../../../features/lists/photos-list/PhotosList';

const Photos = observer(({}) => {
    let photos = StorageState
        .GetSelectionByType(GlobalContext.supportedImageTypes);

    return (
        <ContentWrapper>
            <AddInGallery />
            <PhotosList 
                photos={photos}
                isHasMore={StorageState.isHasMorePhotos}
                callback={async () => await FilesController.GetLastFilesWithType(
                    5, 
                    photos.length, 
                    'gallery',
                    StorageState.OnGetFilesByTypeSuccess
                )}
            />
        </ContentWrapper>
    );
});

export default Photos;