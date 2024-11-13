import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';
import userState from '../../../../states/user-state';
import AccountController from '../../../../api/AccountController';

const User = observer(({id, name, nickname, avatar, coins, friends, space}) => {
    return (
        <div className={styles.user}>
            <div className={styles.avatar}>
                <img src={`data:image/png;base64,${avatar}`} draggable="false" />
            </div>  
            <div className={styles.name}>
                <h1 className={styles.nickname}>{nickname}</h1>
                <span className={styles.fullname}>{name}</span>
            </div>
            <div className={styles.statistic}>
                <StatisticalUnit 
                    title={"Coins"}
                    amount={coins}
                />
                <StatisticalUnit 
                    title={"Friends"}
                    amount={friends}
                />
                <StatisticalUnit 
                    title={"MB"}
                    amount={space}
                />
            </div>
            <div className={styles.button}>
                <Button 
                    value={userState.IsUserInFriends(id) ? "Remove" : "Add"}
                    callback={() => AccountController.FollowUser(id)}
                />
            </div> 
        </div>
    );
});

export default User;