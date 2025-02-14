import StorageController from '../../../../../../../../api/StorageController';
import styles from './main.module.css';

const MessageVideoAttachments = ({path}) => {
    return (
        <video
            className={styles.video}
            controls
            muted
            loop
            autoPlay
            src={StorageController.getFullFileURL(path)}
        >
            <source src={StorageController.getFullFileURL(path)} />
        </video>
    );
};

export default MessageVideoAttachments;