import StorageState, { AdaptId } from '../../../../../../state/entities/StorageState';
import CloudController from '../../../../api/CloudController';
import StorageItemWrapper from '../../../../features/wrappers/storage-item-wrapper/StorageItemWrapper';
import FetchItemsWithPlaceholder from '../../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';
import Collection from '../../../collection/Collection';
import File from '../../../file/File';
import styles from './main.module.css';

const MainCollectionPreviewPage = ({ collectionId }) => {
    const { collections } = StorageState;

    return (
        <div className={styles.main}>
            {collections[AdaptId(collectionId)] && collections[AdaptId(collectionId)].items && collections[AdaptId(collectionId)].items
                .filter(collection => collection.typeId !== 'System')
                .slice()
                .map(collection => {
                    return (
                        <Collection collection={collection} />
                    )
                })}
            {collections[AdaptId(collectionId)] && collections[AdaptId(collectionId)].items && collections[AdaptId(collectionId)].items
                .filter(collection => collection.typeId !== 'System')
                .slice()
                .map(collection => {
                    return (
                        <Collection collection={collection} />
                    )
                })}
            <FetchItemsWithPlaceholder
                item={
                    <StorageItemWrapper>
                        <File isLoading={true} />
                    </StorageItemWrapper>
                }
                isHasMore={false}
                callback={() => CloudController.FetchCollectionData(collectionId)}
            />
        </div>
    );
};

export default MainCollectionPreviewPage;