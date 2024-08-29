import { useEffect } from 'react';
import SubSystemLogo from '../../elements/sub-system-logo/SubSytemLogo';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import PopUpItems from '../../shared/pop-up-window/elements/items/PopUpItems';
import YexiderCloudSubPage from './items/cloud/YexiderCloudSubPage';
import YexiderGallerySubPage from './items/gallery/YexiderGallerySubPage';
import YexiderMusicSubPage from './items/music/YexiderMusicSubPage';
import styles from './main.module.css';

const YexiderCloud = ({open, close, setSelectedFiles, setSelectedFolders}) => {
    useEffect(() => {
        setSelectedFiles([]);
        setSelectedFolders([]);
    }, []);

    return (
        <PopUpWindow
            open={open}
            close={close}
            isHeaderPositionAbsulute={true}
        >
            <div className={styles.yexiderCloud}>
                <div className={styles.header}>
                    <SubSystemLogo title="Cloud" />
                </div>
                <PopUpItems
                    items={[
                        {
                            title: "Cloud", 
                            element: <YexiderCloudSubPage 
                                setSelectedFiles={setSelectedFiles} 
                                setSelectedFolders={setSelectedFolders}
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