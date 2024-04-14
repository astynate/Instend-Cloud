import React, { useContext } from 'react';
import styles from './main.module.css';
import { OpenAccessContext } from '../../../../pages/cloud/widgets/open-access/OpenAccess';

const Friends = (props) => {
    const context = useContext(OpenAccessContext);

    return (
        <div className={styles.friends}>
            {context.searchUsers && context.searchUsers.map ? 
                context.searchUsers.map((user, index) =>
                    <div className={styles.friend} key={index}>
                        <img className={styles.avatar} src={`data:image/png;base64,${user.avatar}`} />
                        <div className={styles.description}>
                            <span className={styles.username}>{user.nickname}</span>
                            <span className={styles.fullname}>{user.name} {user.surname}</span>
                        </div>
                        {user.ability ? 
                            <div className={styles.select}>
                                {props.children}
                            </div>
                        : 
                            <div className={styles.button}>
                                <span>Add</span>
                            </div>}
                    </div>
                )
            : null}
        </div>
    );

};

export default Friends;