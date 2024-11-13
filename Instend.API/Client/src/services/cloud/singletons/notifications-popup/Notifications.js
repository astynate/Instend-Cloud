import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';

const Notifications = observer(() => {
    return (
        <div className={styles.notifications}>
            <div className={styles.header}>
                <h2 className={styles.title}>Notifications</h2>
                {/* <BurgerMenu 
                    items={[
                        {title: "Settings", callback: () => {}}
                    ]}
                /> */}
            </div>
            {/* <div className={styles.content}>
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
                                    {title: "Accept", callback: () => AccountController.AcceptFriend(element.id)},
                                    {title: "Reject", callback: () => AccountController.FollowUser(element.id)}
                                ]}
                            />
                        );
                })}
            </div> */}
        </div>
    )
});

export default Notifications;