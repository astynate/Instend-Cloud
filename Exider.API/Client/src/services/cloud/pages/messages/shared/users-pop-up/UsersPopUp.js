import React, { useState } from "react";
import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from "../../../../shared/pop-up-window/elements/search/Search";
import Button from "../../../../shared/ui-kit/button/Button";
import UserAvatar from "../../../../widgets/avatars/user-avatar/UserAvatar";

const UsersPopUp = ({title, 
        open, 
        close, 
        userButton, 
        callback, 
        setSearchResult, 
        setSearchingState, 
        setLoadingState, 
        GetData,
        searchUsers,
        isHasSubmitButton,
        userCallback
    }) => {
    return (
        <PopUpWindow
            open={open}
            close={close}
            title={'New chat'}
        >
            <div className={styles.createChat}>
                <Search 
                    setSearchResult={setSearchResult}
                    setSearchingState={setSearchingState}
                    setLoadingState={setLoadingState}
                    GetData={GetData}
                />
                <div className={styles.users}>
                    {searchUsers.length > 0 ? 
                        searchUsers.map((user, index) => {
                            if (!user || !user.name || !user.nickname || !user.surname) {
                                return null;
                            }

                            return (
                                <div className={styles.user} key={index} onClick={() => userCallback(user)}>
                                    <UserAvatar 
                                        user={user}
                                    />
                                    <div className={styles.information}>
                                        <span className={styles.nickname}>{user.nickname}</span>
                                        <span className={styles.name}>{user.name} {user.surname}</span>
                                    </div>
                                    {userButton}
                                </div>
                            );
                        })
                    :
                        <div className={styles.placeholder}>
                            <span>No users found</span>
                        </div>
                    }
                </div>
                {isHasSubmitButton && <div className={styles.buttonWrapper}>
                    <Button 
                        value={title}
                        callback={callback}
                    />
                </div>}
            </div>
        </PopUpWindow>
    );
}

export default UsersPopUp;