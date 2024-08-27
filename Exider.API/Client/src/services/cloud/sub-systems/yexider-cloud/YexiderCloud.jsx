import SubSystemLogo from '../../elements/sub-system-logo/SubSytemLogo';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import PopUpItems from '../../shared/pop-up-window/elements/items/PopUpItems';
import YexiderCloudSubPage from './items/cloud/YexiderCloudSubPage';
import YexiderGallerySubPage from './items/gallery/YexiderGallerySubPage';
import styles from './main.module.css';

const YexiderCloud = ({open, close}) => {
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
                            element: <YexiderCloudSubPage />,
                        },
                        {
                            title: "Gallery", 
                            element: <YexiderGallerySubPage />,
                        },
                        {
                            title: "Music", 
                            element: <h1 className={styles.placeholder}>No music uploaded</h1>,
                        },
                    ]}
                />
            </div>
        </PopUpWindow>
    );
}

export default YexiderCloud;