import React, { useState } from 'react';
import { AdaptId } from '../../../../state/entities/StorageState';
import { useParams } from 'react-router-dom';
import PopUpField from '../../shared/popup-windows/pop-up-filed/PopUpField';
import CollectionsController from '../../api/CollectionsController';
import ContextMenu from '../../shared/context-menus/context-menu/ContextMenu';
import { ConvertFullDate } from '../../../../handlers/DateHandler';
import Collection from '../../components/collection/Collection';
import rename from './images/rename.png';
import remove from './images/delete.png';
import { observer } from 'mobx-react-lite';

const CollectionsArrayTemplate = observer(({collections, sortingType}) => {
    let params = useParams();
    const [ids, setIds] = useState([]);
    const [isRenameCollectionOpen, setRenameCollectionState] = useState(false);
    const [collectionName, setCollectionName] = useState('');

    return (
        <>
            <PopUpField
                title={'Rename collection'}
                text={'Name should contains at least one symbol'}
                field={[collectionName, setCollectionName]}
                placeholder={'Collection name'}
                open={isRenameCollectionOpen}
                close={() => setRenameCollectionState(false)}
                callback={() => CollectionsController.RenameCollection(collectionName, ids[0])}
            />
            {collections[AdaptId(params.id)] && collections[AdaptId(params.id)].items && collections[AdaptId(params.id)].items
                .filter(collection => collection.typeId !== 'System')
                .slice()
                // .sort((a, b) => sortItems(a, b, sortingType))
                .map(collection => {
                    const renameCallback = () => {
                        setRenameCollectionState(true);
                        setCollectionName(collection.name);
                        setIds([collection.id]);
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
        </>
    );
});

export default CollectionsArrayTemplate;