import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './styles/main.module.css';
import AccountState from '../../../../state/entities/AccountState';

const MiniProfile = observer(() => {
    const { account } = AccountState;

    return (
        <div className={styles.miniProfile}>
            <img src={`data:image/png;base64,${account.avatar}`} className={styles.avatar} draggable="false" />
            <div className={styles.name}>
                <h1>{account.nickname}</h1>
                <span>{account.name} {account.surname}</span>
            </div>
        </div>
    );
});

export default MiniProfile;