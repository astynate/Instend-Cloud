import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import StorageState, { AdaptId } from '../../../../../../state/entities/StorageState';
import Collection from '../../../../components/collection/Collection';
import CollectionsController from '../../../../api/CollectionsController';
import CloudController from '../../../../api/CloudController';
import SelectElementWithCheckmark from '../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import FilesController from '../../../../api/FilesController';
import File from '../../../../components/file/File';
import FetchItemsWithPlaceholder from '../../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';
import StorageItemWrapper from '../../../../features/wrappers/storage-item-wrapper/StorageItemWrapper';

const InstendCloudSubPage = observer(({
        selectedCollections = [], 
        setSelectedCollections = () => {}, 
        selectedFiles = [], 
        setSelectedFiles = () => {}, 
        setCollectionId = () => {}, 
        collectionId
    }) => {

    const { collections, files } = StorageState;

    useEffect(() => {
        const isHasMoreCollections = StorageState
            .IsItemsHasMore(collectionId, StorageState.collections);

        const setCollections = (items) => StorageState
            .SetItems(collectionId, StorageState.collections, items, true);

        if (isHasMoreCollections)
            CollectionsController.GetCollectionsByParentId(collectionId, setCollections);
    }, [collectionId, collections]);

    useEffect(() => {
        const isHasMoreFiles = StorageState
            .IsItemsHasMore(collectionId, files);

        const setFiles = (files) => StorageState
            .SetItems(collectionId, StorageState.files, files);

        if (isHasMoreFiles)
            FilesController.GetFilesByParentCollectionAndStorageStateId(collectionId, setFiles);
    }, [collectionId, files[AdaptId(collectionId)]?.items]);

    useEffect(() => {
        CloudController.GetPath(collectionId, StorageState.SetPath);
    }, [collectionId]);

    useEffect(() => {
        if (selectedCollections.length > 0) {
            setSelectedFiles([]);
            return;
        };

        if (selectedFiles.length > 0) {
            setSelectedCollections([]);
            return;
        };
    }, [selectedCollections.length, selectedFiles.length]);

    return (
        <div className={styles.wrapper}>
            {collections[AdaptId(collectionId)] && collections[AdaptId(collectionId)].items && collections[AdaptId(collectionId)].items
                .filter(element => element.typeId !== 'System')
                .map((collection) => (
                    <SelectElementWithCheckmark 
                        isSelectedOpen={true} 
                        key={collection.id}
                        setItems={setSelectedCollections}
                        items={selectedCollections}
                        item={collection}
                        maxLength={4}
                    >
                        <Collection
                            collection={collection}
                            onContextMenu={() => {}}
                            callback={() => setCollectionId(collection.id)}
                            isHasLink={false}
                        />
                    </SelectElementWithCheckmark>
                ))}
            {files[AdaptId(collectionId)] && files[AdaptId(collectionId)].items && files[AdaptId(collectionId)].items
                .map((file) => (
                    <SelectElementWithCheckmark 
                        isSelectedOpen={true} 
                        key={file.id}
                        setItems={setSelectedFiles}
                        items={selectedFiles}
                        item={file}
                        maxLength={7}
                    >
                        <File file={file} />
                    </SelectElementWithCheckmark>
                ))}
        </div>
    );
});

export default InstendCloudSubPage;