import StorageState from '../../../../state/entities/StorageState';
import CloudController from '../../api/CloudController';
import File from '../../components/file/File';
import StorageItemWrapper from '../../features/wrappers/storage-item-wrapper/StorageItemWrapper';
import FetchItemsWithPlaceholder from '../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';

const FetchCollectionData = ({ id }) => {
    const { AreThereMoreItems, files, collections } = StorageState;

    return (
        <FetchItemsWithPlaceholder
            item={
                <StorageItemWrapper>
                    <File isLoading={true} />
                </StorageItemWrapper>
            }
            isHasMore={AreThereMoreItems(id, collections) || AreThereMoreItems(id, files)}
            callback={async () => {
                if (AreThereMoreItems(id, collections)) {
                    await CloudController.FetchCollectionsByCollectionId(id);
                };
                
                if (AreThereMoreItems(id, files)) {
                    await CloudController.FetchFilesByCollectionId(id);
                };
            }}
        />
    );
};

export default FetchCollectionData;