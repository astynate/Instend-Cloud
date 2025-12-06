import React, { useState } from 'react';
import { AdaptId } from '../../../../state/entities/StorageState';
import { useParams } from 'react-router-dom';
import { sortItems } from '../../pages/cloud/pages/main/SortingHelper';
import PopUpField from '../../shared/popup-windows/pop-up-filed/PopUpField';
import ContextMenu from '../../shared/context-menus/context-menu/ContextMenu';
import { ConvertFullDate } from '../../../../handlers/DateHandler';
import rename from './images/rename.png';
import remove from './images/delete.png';
import { observer } from 'mobx-react-lite';
import File from '../../components/file/File';
import FilesController from '../../api/FilesController';
import SelectElementWithCheckmark from '../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';

const FilesArrayTemplate = observer(({files, sortingType}) => {
    let params = useParams();
    const [ids, setIds] = useState([]);
    const [isRenameFileOpen, setRenameFileState] = useState(false);
    const [fileName, setFileName] = useState('');

    return (
        <>
            <PopUpField
                title={'Rename collection'}
                text={'Name should contains at least one symbol'}
                field={[fileName, setFileName]}
                placeholder={'Collection name'}
                open={isRenameFileOpen}
                close={() => setRenameFileState(false)}
                callback={() => FilesController.RenameFile(fileName, ids[0])}
            />
            {files[AdaptId(params.id)] && files[AdaptId(params.id)].items && files[AdaptId(params.id)].items
                .slice()
                .sort((a, b) => sortItems(a, b, sortingType))
                .map(file => {
                    const renameCallback = () => {
                        setRenameFileState(true);
                        setFileName(file.name);
                        setIds([file.id]);
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
                            <SelectElementWithCheckmark isSelectedOpen={ids.length > 0}>
                                <File file={file} isLoading={file.isLoading} />
                            </SelectElementWithCheckmark>
                        </ContextMenu>
                    )
                })}
        </>
    );
});

export default FilesArrayTemplate;