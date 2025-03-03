import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import StorageController from '../../../../api/StorageController';
import AccountState from '../../../../state/entities/AccountState';
import FollowersController from '../../../../api/FollowersController';

const User = observer(({id, name, nickname, avatar}) => {
    const IsFollowing = !AccountState.IsAccountInTheListOfFollowingAcounts(id);

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
            <button 
                id={IsFollowing ? 'follow' : 'unfollow'}
                className={styles.button}
                onClick={() => FollowersController.Follow(id)}
            >
                {IsFollowing ? 'Follow' : 'Unfollow'}
            </button> 
        </div>
    );
});

export default User;