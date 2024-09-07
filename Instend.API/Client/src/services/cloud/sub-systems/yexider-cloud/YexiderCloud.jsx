import { useEffect, useState } from 'react';
import SubSystemLogo from '../../elements/sub-system-logo/SubSytemLogo';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import PopUpItems from '../../shared/pop-up-window/elements/items/PopUpItems';
import YexiderCloudSubPage from './items/cloud/YexiderCloudSubPage';
import YexiderGallerySubPage from './items/gallery/YexiderGallerySubPage';
import YexiderMusicSubPage from './items/music/YexiderMusicSubPage';
import styles from './main.module.css';
import arrow from './images/arrow.png';
import storageState from '../../../../states/storage-state';

const YexiderCloud = ({open, close, setSelectedFiles, setSelectedFolders}) => {
    const [folderName, setFolderName] = useState(); 
    const [folderId, setFolderId] = useState(null);

    useEffect(() => {
        setSelectedFiles([]);
        setSelectedFolders([]);
    }, []);

    useEffect(() => {
        storageState.SetFolderItemsById(folderId);
        setFolderName(folderId ? storageState.FindFolderById(folderId).name ?? "Unknown" : undefined);
    }, [folderId]);

    return (
        <PopUpWindow
            open={open}
            close={close}
            isHeaderPositionAbsulute={true}
        >
            <div className={styles.yexiderCloud}>
                <div 
                    className={styles.header}
                    onClick={() => {
                        const path = storageState.path[folderId];
                        setFolderId(path.length === 1 ? null : path[path.length - 2].id);
                    }}
                >
                    <SubSystemLogo 
                        icon={folderName ? arrow : undefined} 
                        title={folderName}
                        subTitle={folderName ? "" : "Cloud"}
                    />
                </div>
                <PopUpItems
                    items={[
                        {
                            title: "Cloud", 
                            element: <YexiderCloudSubPage 
                                setSelectedFiles={setSelectedFiles} 
                                setSelectedFolders={setSelectedFolders}
                                setFolderName={setFolderName}
                                folderId={folderId}
                                setFolderId={setFolderId}
                            />,
                        },
                        {
                            title: "Gallery", 
                            element: <YexiderGallerySubPage 
                                setSelectedFiles={setSelectedFiles} 
                            />,
                        },
                        {
                            title: "Music", 
                            element: <YexiderMusicSubPage 
                                setSelectedFiles={setSelectedFiles} 
                            />,
                        },
                    ]}
                />
            </div>
        </PopUpWindow>
    );
}

export default YexiderCloud;