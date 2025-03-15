import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { sortItems } from './SortingHelper';
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
import FetchItemsWithPlaceholder from '../../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';
import StorageItemWrapper from '../../../../features/wrappers/storage-item-wrapper/StorageItemWrapper';

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
    const { files, collections } = StorageState;
    const params = useParams();

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
                                        <File
                                            file={file}
                                            isLoading={file.isLoading}
                                        />
                                    </SelectElementWithCheckmark>
                                </ContextMenu>
                            )
                        })}
                    <FetchItemsWithPlaceholder
                        item={
                            <StorageItemWrapper>
                                <File isLoading={true} />
                            </StorageItemWrapper>
                        }
                        isHasMore={StorageState.AreThereMoreItems(params.id, collections) || StorageState.AreThereMoreItems(params.id, files)}
                        callback={async () => {
                            if (StorageState.AreThereMoreItems(params.id, collections)) {
                                await CloudController.FetchCollectionsByCollectionId(params.id);
                            };
                            
                            if (StorageState.AreThereMoreItems(params.id, files)) {
                                await CloudController.FetchFilesByCollectionId(params.id);
                            };
                        }}
                    />
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