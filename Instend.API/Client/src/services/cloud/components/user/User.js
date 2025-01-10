import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import StorageController from '../../../../api/StorageController';

const User = observer(({id, name, nickname, avatar}) => {
    return (
        <div className={styles.user}>
            <Link to={`/profile/${id}`} className={styles.information}>
                <div className={styles.avatar}>
                    <img 
                        src={StorageController.getFullFileURL(avatar)} 
                        draggable="false" 
                    />
                </div>  
                <div className={styles.name}>
                    <h1 className={styles.nickname}>{nickname}</h1>
                    <span className={styles.fullname}>{name}</span>
                </div>
            </Link>
            <button className={styles.button}>Follow</button> 
        </div>
    );
});

export default User;