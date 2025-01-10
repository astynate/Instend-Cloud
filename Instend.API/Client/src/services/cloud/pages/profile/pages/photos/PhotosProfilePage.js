import { useEffect, useState } from 'react';
import AccountController from '../../../../../../api/AccountController';
import StorageController from '../../../../../../api/StorageController';
import styles from './main.module.css';

const PhotosProfilePage = ({account}) => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        if (!!account === true && account.id) {
            AccountController.GetAccountPhotos(
                account.id,
                setPhotos,
                photos.length
            );
        }
    }, [photos.length]);

    if (!!account === false) {
        return null;
    }

    return (
        <div className={styles.photos}>
            {photos.map(photo => {
                return (
                    <img 
                        key={photo.id}
                        draggable="false"
                        className={styles.photo}
                        src={StorageController.getFullFileURL(photo.path)} 
                    />
                );
            })}
        </div>   
    );
};

export default PhotosProfilePage;