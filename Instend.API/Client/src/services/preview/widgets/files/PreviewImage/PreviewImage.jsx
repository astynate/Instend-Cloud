import StorageController from '../../../../../api/StorageController';
import styles from './main.module.css';

const PreviewImage = ({file}) => {
    return (
        <img 
            className={styles.image}
            src={StorageController.getFullFileURL(file.path)} 
            draggable='false'
        />
    );
};

export default PreviewImage;