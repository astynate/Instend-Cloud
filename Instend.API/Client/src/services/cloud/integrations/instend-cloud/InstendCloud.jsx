import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import PopUpWindow from '../../shared/popup-windows/pop-up-window/PopUpWindow';
import SubSystemLogo from '../../elements/sub-system-elements/sub-system-logo/SubSytemLogo';
import InstendCloudSubPage from './items/cloud/InstendCloudSubPage';
import arrow from './images/arrow.png';
import PopUpItems from '../../shared/popup-windows/pop-up-window/elements/items/PopUpItems';
import StorageState from '../../../../state/entities/StorageState';
import InstendPhotosSubPage from './items/photos/InstendPhotosSubPage';
import InstendMusicSubPage from './items/music/InstendMusicSubPage';

const InstendCloud = observer(({
        isOpen = false, 
        windowIndex = 0,
        close = () => {}, 
        collections = [],
        files = [],
        setSelectedFiles = () => {}, 
        setSelectedCollections = () => {},
    }) => {

    const [collectionId, setCollectionId] = useState(null);
    const { path } = StorageState;

    const GetCurrentCollectionName = () => {
        return path && path.length > 0 ? path[0].name : 'Instend';
    };

    return (
        <PopUpWindow
            open={isOpen}
            close={close}
            isHeaderless={false}
            isHeaderPositionAbsolute={true}
        >
            <div className={styles.InstendCloud}>
                <div 
                    className={styles.header}
                    onClick={() => {
                        if (!path || !path.length) {
                            setCollectionId(null);
                            return;
                        };

                        setCollectionId(path.length <= 1 ? null : path[1].id);
                    }}
                >
                    <SubSystemLogo
                        icon={collectionId ? arrow : undefined} 
                        title={collectionId ? GetCurrentCollectionName() : 'Instend'}
                        subTitle={collectionId ? "" : "Cloud"}
                    />
                </div>
                <PopUpItems
                    currentIndex={windowIndex}
                    items={[
                        {
                            title: "Cloud", 
                            element: <InstendCloudSubPage
                                selectedCollections={collections}
                                selectedFiles={files}
                                collectionId={collectionId}
                                setSelectedFiles={setSelectedFiles}
                                setCollectionId={setCollectionId}
                                setSelectedCollections={setSelectedCollections}
                            />,
                        },
                        {
                            title: "Photos", 
                            element: <InstendPhotosSubPage
                                files={files}
                                setFiles={setSelectedFiles}
                            />,
                        },
                        {
                            title: "Songs", 
                            element: <InstendMusicSubPage
                                files={files}
                                setFiles={setSelectedFiles}
                            />
                        },
                    ]}
                />
            </div>
        </PopUpWindow>
    );
});

export default InstendCloud;