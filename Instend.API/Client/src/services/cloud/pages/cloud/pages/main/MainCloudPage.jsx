import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ConvertFullDate } from '../../../../../../handlers/DateHandler';
import PopUpField from '../../../../shared/popup-windows/pop-up-filed/PopUpField';
import AddInFolder from '../../features/add-in-folder/AddInFolder';
import StorageState, { AdaptId } from '../../../../../../state/entities/StorageState';
import CollectionsController from '../../../../api/CollectionsController';
import FilesController from '../../../../api/FilesController';
import Collection from '../../../../components/collection/Collection';
import styles from './main.module.css';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import CloudController from '../../../../api/CloudController';
import ContextMenu from '../../../../shared/context-menus/context-menu/ContextMenu';
import remove from './images/remove.png';
import rename from './images/rename.png';
import File from '../../../../components/file/File';
import SelectElementWithCheckmark from '../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import { sortItems } from './SortingHelper';

const MainCloudPage = observer(({isAscending, sortingType}) => {
    const [newItemName, setNewItemName] = useState('');
    const [isRenameCollectionOpen, setRenameCollectionState] = useState(false);
    const [isRenameFileOpen, setRenameFileState] = useState(false);
    const [ids, setIds] = useState([]);
    const [id, setId] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [fileName, setFileName] = useState('');
    const [isNewItem, setNewItemState] = useState();
    const [creationType, setCreationType] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const params = useParams();
    const { files, collections } = StorageState;

    useEffect(() => {
        const isHasMoreCollections = StorageState
            .IsItemsHasMore(params.id, StorageState.collections);

        const setCollections = (collections) => StorageState
            .SetItems(params.id, StorageState.collections, collections);

        if (isHasMoreCollections)
            CollectionsController.GetCollectionsByParentId(params.id, setCollections);
    }, [params.id, collections]);

    useEffect(() => {
        const isHasMoreFiles = StorageState
            .IsItemsHasMore(params.id, files);

        const setFiles = (files) => StorageState
            .SetItems(params.id, StorageState.files, files);

        if (isHasMoreFiles)
            FilesController.GetFilesByParentCollectionAndStorageStateId(params.id, setFiles);
    }, [params.id, files[AdaptId(params.id)]?.items]);

    useEffect(() => {
        CloudController.GetPath(params.id, StorageState.SetPath);
    }, [params.id]);

    return (
        <>
            <PopUpField
                title={creationType.title}
                text={creationType.text}
                field={[newItemName, setNewItemName]}
                placeholder={creationType.placeholder}
                open={isNewItem}
                close={() => setNewItemState(false)}
                callback={() => creationType.callback(newItemName, params.id)}
            />
            <PopUpField
                title={'Rename collection'}
                text={'Name should contains at least one symbol'}
                field={[collectionName, setCollectionName]}
                placeholder={'Collection name'}
                open={isRenameCollectionOpen}
                close={() => setRenameCollectionState(false)}
                callback={() => CollectionsController.RenameCollection(collectionName, id)}
            />
            <PopUpField
                title={'Rename file'}
                text={'Name should contains at least one symbol'}
                field={[fileName, setFileName]}
                placeholder={'File name'}
                open={isRenameFileOpen}
                close={() => setRenameFileState(false)}
                callback={() => FilesController.RenameFile(fileName, id)}
            />
            <ContentWrapper>
                <div className={styles.items}>
                    {collections[AdaptId(params.id)] && collections[AdaptId(params.id)].items && collections[AdaptId(params.id)].items
                        .filter(collection => collection.typeId !== 'System')
                        .slice()
                        .sort((a, b) => sortItems(a, b, sortingType))
                        .map(collection => {
                            const renameCallback = () => {
                                setRenameCollectionState(true);
                                setCollectionName(collection.name);
                                setId(collection.id);
                            };

                            return (
                                <ContextMenu 
                                    key={collection.id}
                                    textBefore={ConvertFullDate(collection.creationTime)}
                                    onContextMenu={() => setIds([collection.id])}
                                    items={[
                                        {title: "Rename", image: rename, callback: renameCallback},
                                        {title: "Delete", red: true, image: remove, callback: () => CollectionsController.Delete(ids) },
                                    ]}
                                >
                                    <Collection collection={collection} />
                                </ContextMenu>
                            )
                        })}
                    {files[AdaptId(params.id)] && files[AdaptId(params.id)].items && files[AdaptId(params.id)].items
                        .slice()
                        .sort((a, b) => sortItems(a, b, sortingType))
                        .map(file => {
                            const renameCallback = () => {
                                setRenameFileState(true);
                                setFileName(file.name);
                                setId(file.id);
                            };

                            return (
                                <ContextMenu 
                                    key={file.id}
                                    textBefore={ConvertFullDate(file.creationTime)}
                                    onContextMenu={() => setIds([file.id])}
                                    items={[
                                        {title: "Rename", image: rename, callback: renameCallback},
                                        {title: "Delete", red: true, image: remove, callback: () => FilesController.Delete(ids)},
                                    ]}
                                >
                                    <SelectElementWithCheckmark
                                        isSelectedOpen={selectedFiles.length > 0}
                                    >
                                        <div>
                                            <File
                                                file={file}
                                                isLoading={file.isLoading}
                                            />
                                        </div>
                                    </SelectElementWithCheckmark>
                                </ContextMenu>
                            )
                        })}
                </div>
            </ContentWrapper>
            <AddInFolder
                OpenDialog={(type) => {
                    setNewItemState(true);
                    setCreationType(type);
                }}
            />
        </>
    );
});

export default MainCloudPage;