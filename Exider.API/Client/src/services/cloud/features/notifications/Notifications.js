import React from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import BurgerMenu from '../../shared/ui-kit/burger-menu/BurgerMenu';
import Notification from '../../shared/social/notification/Notification';
import userState from '../../../../states/user-state';
import { instance } from '../../../../state/Interceptors';
import { followUser } from '../../pages/explore/features/user/User';

const Notifications = observer(() => {
    return (
        <div className={styles.notifications}>
            <div className={styles.header}>
                <h2 className={styles.title}>Notifications</h2>
                <BurgerMenu 
                    items={[
                        {title: "Settings", callback: () => {}}
                    ]}
                />
            </div>
            <div className={styles.content}>
                {userState.friends
                    .filter(element => element.isSubmited === false && element.userId === userState.user.id)
                    .map((element, index) => {
                        if (!element.avatar) {
                            const id = userState.user.id === element.userId ? 
                                element.ownerId : element.userId;

                            userState.GetFriend(id);
                        }
                        return (
                            <Notification 
                                avatar={element.avatar}
                                title={element.nickname}
                                text={"Send you a friend request"}
                                key={index}
                                isLoading={!element.nickname}
                                items={[
                                    {title: "Accept", callback: async () => {
                                        await instance.put(`/api/friends?id=${element.id}`)
                                            .then(response => {
                                                if (response.data) {
                                                    const {userId, id} = response.data;
                                                    userState.ChangeFriendState(userId, id);
                                                }
                                            });
                                    }},
                                    {title: "Reject", callback: async () => {
                                        await followUser(element.id);
                                    }}
                                ]}
                            />
                        );
                })}
            </div>
        </div>
    )
});

export default Notifications;