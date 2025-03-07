import React from 'react';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import StorageItemDescription from '../../features/storage/storage-item-description/StorageItemDescription';
import StorageController from '../../../../api/StorageController';

const Album = ({album = {}}) => {
    if (album.isLoading === true) {
        return (
            <div className={styles.album} id="loading">
                <div className={styles.coverWrapper}>
                    <div className={styles.cover}>
                    </div>
                </div>
                <StorageItemDescription name={album.name} />
            </div>
        );
    };

    return (
        <Link to={`/gallery/albums/${album.id}`} className={styles.album} data={album.id}>
            <img 
                src={StorageController.getFullFileURL(album.cover)} 
                className={styles.cover}
                draggable="false"
            />
            <StorageItemDescription
                name={album.name} 
                time={album.creationTime}
            />
        </Link>
    );
};

export default Album;