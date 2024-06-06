import React from 'react';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';
import { instance } from '../../../../../../state/Interceptors';
import userState from '../../../../../../states/user-state';
import applicationState from '../../../../../../states/application-state';
import { observer } from 'mobx-react-lite';

export const followUser = async (id) => {
    if (id) {
        await instance
            .post(`/api/friends?id=${id}`)
            .then(response => {
                if (response && response.data) {
                    if (response.data.isRemove) {
                        userState.RemoveFriend(response.data.userId, response.data.ownerId);
                    } else {
                        userState.AddFriend(response.data);
                    }
                }
            })
            .catch(error => {
                applicationState.AddErrorInQueueByError('Attention!', error);
            });
    }
}

const User = observer(({id, name, nickname, avatar, coins, friends, space}) => {
    return (
        <div className={styles.user}>
            <div className={styles.avatar}>
                <img src={`data:image/png;base64,${avatar}`} />
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
                    callback={() => followUser(id)}
                />
            </div> 
        </div>
    );
});

export default User;