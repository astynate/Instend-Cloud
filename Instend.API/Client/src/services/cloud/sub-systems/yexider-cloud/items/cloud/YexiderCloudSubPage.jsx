import { useEffect, useState } from 'react';
import storageState, { AdaptId } from '../../../../../../states/storage-state';
import File from '../../../../pages/cloud/shared/file/File';
import Folder from '../../../../pages/cloud/shared/folder/Folder';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';

const YexiderCloudSubPage = observer(({setSelectedFiles, setSelectedFolders}) => {
    const [folderId, setFolderId] = useState(null);
    const { folders, files } = storageState;

    useEffect(() => {
        storageState.SetFolderItemsById(folderId);
    }, [folderId]);

    return (
        <div className={styles.wrapper}>
            {folders[AdaptId(folderId)] && folders[AdaptId(folderId)]
                .filter(element => element.typeId !== 'System')
                .map((element) => (
                    <Folder 
                        key={element.id}
                        id={element.id}
                        isSelected={false}
                        folder={element}
                        name={element.name} 
                        time={element.creationTime}
                        isLoading={element.isLoading}
                        setSelectedFolders={setSelectedFolders}
                        isPreventDefault={true}
                        callback={() => {
                            setFolderId(element.id);
                        }}
                    />
            ))}
            {files[AdaptId(folderId)] && files[AdaptId(folderId)]
                .map((element) => (
                    <File
                        key={element.id} 
                        name={element.name}
                        file={element}
                        time={element.lastEditTime}
                        image={element.preview == "" ? null : element.preview}
                        type={element.type}
                        isLoading={element.isLoading}
                        isSelected={false}
                        setSelectedFiles={setSelectedFiles}
                    />
            ))}
        </div>
    );
});

export default YexiderCloudSubPage;