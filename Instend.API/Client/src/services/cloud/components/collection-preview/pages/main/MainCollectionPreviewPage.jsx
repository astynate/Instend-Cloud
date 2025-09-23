import { observer } from 'mobx-react-lite';
import StorageState, { AdaptId } from '../../../../../../state/entities/StorageState';
import FetchCollectionData from '../../../../singletons/fetch-collection-data/FetchCollectionData';
import Collection from '../../../collection/Collection';
import styles from './main.module.css';
import File from '../../../file/File';

const MainCollectionPreviewPage = observer(({ collectionId }) => {
    const { collections, files } = StorageState;

    return (
        <div className={styles.main}>
            {collections[AdaptId(collectionId)] && collections[AdaptId(collectionId)].items && collections[AdaptId(collectionId)].items
                .map(collection => {
                    return (
                        <Collection key={collection.id} collection={collection} />
                    )
                })}
            {files[AdaptId(collectionId)] && files[AdaptId(collectionId)].items && files[AdaptId(collectionId)].items
                .map(file => {
                    return (
                        <File key={file.id} file={file} />
                    )
                })}
            <FetchCollectionData id={collectionId} />
        </div>
    );
});

export default MainCollectionPreviewPage;