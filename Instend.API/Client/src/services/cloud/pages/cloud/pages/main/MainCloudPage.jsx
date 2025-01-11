import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PopUpField from '../../../../shared/popup-windows/pop-up-filed/PopUpField';
import AddInFolder from '../../features/add-in-folder/AddInFolder';
import styles from './main.module.css';
import StorageState from '../../../../../../state/entities/StorageState';
import CollectionsController from '../../../../api/CollectionsController';

const MainCloudPage = () => {
    const [fileName, setFilename] = useState('');
    const [isRenameOpen, setRenameState] = useState(false);
    const [activeItems, setActiveItems] = useState([]);
    const [isNewItem, setNewItemState] = useState();
    const [creationType, setCreationType] = useState({});
    const params = useParams();

    useEffect(() => {
        const isHasMoreCollections = StorageState.IsItemsHasMore(params.id, StorageState.collections);
        const isHasMoreFiles = StorageState.IsItemsHasMore(params.id, StorageState.files);

        const setCollections = (collections) => StorageState.SetItems(params.id, StorageState.collections, collections);
        const setFiles = (files) => StorageState.SetItems(params.id, StorageState.collections, files);

        if (isHasMoreCollections)
            CollectionsController.GetCollectionsByParentId(params.id, setCollections);

        if (isHasMoreFiles)
            CollectionsController.GetCollectionsByParentId(params.id, setFiles);
    }, [params.id]);

    return (
        <>

            <PopUpField
                title={creationType.title}
                text={creationType.text}
                field={[fileName, setFilename]}
                placeholder={creationType.placeholder}
                open={isNewItem}
                close={() => setNewItemState(false)}
                callback={() => {}}
            />
            <AddInFolder
                OpenDialog={(type) => {
                setNewItemState(true);
                setCreationType(type);
                }}
            />
        </>
    );
};

export default MainCloudPage;