import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import StorageState from '../../../../../../state/entities/StorageState';
import GlobalContext from '../../../../../../global/GlobalContext';
import FilesController from '../../../../api/FilesController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';
import PhotosList from '../../../../features/lists/photos-list/PhotosList';

const Photos = observer(({}) => {
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
            <AddInGallery />
            <PhotosList 
                photos={photos} 
            />
        </ContentWrapper>
    );
});

export default Photos;