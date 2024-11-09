import React from 'react';
import styles from './styles/main.module.css';
import { observer } from 'mobx-react-lite';
import userState from '../../../../state/entities/UserState';

const MiniProfile = observer(() => {

    const { user } = userState;

    return (

        <div className={styles.miniProfile}>
            <img src={`data:image/png;base64,${user.avatar}`} className={styles.avatar} draggable="false" />
            <div className={styles.name}>
                <h1>{user.nickname}</h1>
                <span>{user.name} {user.surname}</span>
            </div>
        </div>

    );

});

export default MiniProfile;