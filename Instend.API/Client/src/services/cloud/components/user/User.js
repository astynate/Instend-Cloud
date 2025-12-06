import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import StorageController from '../../../../api/StorageController';
import StorageItemWrapper from '../../features/wrappers/storage-item-wrapper/StorageItemWrapper';

const User = observer(({user}) => {
    if (!!user === null) {
        return <></>;
    };

    return (
        <StorageItemWrapper>
            <div className={styles.user}>
                <Link to={`/profile/${user.id}`} className={styles.information}>
                    <div className={styles.avatar}>
                        <img 
                            src={StorageController.getFullFileURL(user.avatar)} 
                            draggable="false" 
                        />
                    </div>  
                    <div className={styles.name}>
                        <h1 className={styles.nickname}>{user.nickname}</h1>
                        <span className={styles.fullname}>{user.name}</span>
                    </div>
                </Link>
            </div>
        </StorageItemWrapper>
    );
});

export default User;