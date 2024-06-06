import React from 'react';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';
import { instance } from '../../../../../../state/Interceptors';

const User = ({id, name, nickname, avatar, coins, friends, space}) => {
    const follow = async () => {
        if (id) {
            await instance.post(`/api/friends?${id}`);
        }
    }

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
                    value="Follow"
                    callback={() => follow()}
                />
            </div> 
        </div>
    );
 };

export default User;