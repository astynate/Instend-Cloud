import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import PopUpField from '../../../../shared/popup-windows/pop-up-filed/PopUpField';
import AddInFolder from '../../features/add-in-folder/AddInFolder';
import StorageState, { AdaptId } from '../../../../../../state/entities/StorageState';
import CollectionsController from '../../../../api/CollectionsController';
import FilesController from '../../../../api/FilesController';
import Collection from '../../../../components/collection/Collection';
import styles from './main.module.css';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import CloudController from '../../../../api/CloudController';

const MainCloudPage = observer(() => {
    const [fileName, setFileName] = useState('');
    const [isRenameOpen, setRenameState] = useState(false);
    const [activeItems, setActiveItems] = useState([]);
    const [isNewItem, setNewItemState] = useState();
    const [creationType, setCreationType] = useState({});
    
    const params = useParams();
    const { collections } = StorageState;

    useEffect(() => {
        const isHasMoreCollections = StorageState
            .IsItemsHasMore(params.id, StorageState.collections);

        const setCollections = (collections) => StorageState
            .SetItems(params.id, StorageState.collections, collections);

        if (isHasMoreCollections)
            FilesController.GetFilesByParentCollectionId(params.id, setCollections);
    }, [params.id, StorageState.collections]);

    useEffect(() => {
        const isHasMoreFiles = StorageState
            .IsItemsHasMore(params.id, StorageState.files);

        const setFiles = (files) => StorageState
            .SetItems(params.id, StorageState.collections, files);

        if (isHasMoreFiles)
            CollectionsController.GetCollectionsByParentId(params.id, setFiles);
    }, [params.id, StorageState.files]);

    useEffect(() => {
        CloudController.GetPath(params.id, StorageState.SetPath);
    }, [params.id]);

    return (
        <>
            <PopUpField
                title={creationType.title}
                text={creationType.text}
                field={[fileName, setFileName]}
                placeholder={creationType.placeholder}
                open={isNewItem}
                close={() => setNewItemState(false)}
                callback={() => creationType.callback(fileName, params.id)}
            />
            <ContentWrapper>
                <div className={styles.items}>
                    {collections[AdaptId(params.id)] && collections[AdaptId(params.id)].items && collections[AdaptId(params.id)].items
                        .filter(collection => collection.typeId !== 'System')
                        .map(collection => {
                            return <Collection
                                key={collection.id}
                                collection={collection}
                            />
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