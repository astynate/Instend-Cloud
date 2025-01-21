import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Account from '../../widgets/account/Account';
import HorizontalScrollWrapper from '../../../../wrappers/horizontal-scroll-wrapper/HorizontalScrollWrapper';

const Friends = ({foundUsers = [], users = [], setUsers = () => {}}) => {
    const [userIds, setUserIds] = useState(users.map(u => u.account.id));

    useEffect(() => {
        setUserIds(users.map(u => u.account.id));
    }, [users, users.length]);

    return (
        <div className={styles.friends}>
            <div className={styles.invitedAccounts}>
                <h1 className={styles.title}>Invited accounts</h1>
                <HorizontalScrollWrapper>
                    {users.map((role) => {
                        return (
                            <div 
                                key={role.account.id}
                                className={styles.account}
                            >
                                <Account 
                                    isEditable={true}
                                    role={role}
                                    account={role.account}
                                />
                            </div>
                        )
                    })}
                </HorizontalScrollWrapper>
            </div>
            {foundUsers.length > 0 && <div>
                <h1 className={styles.title}>Search result</h1>
                <div className={styles.foundAccounts}>
                    {foundUsers
                        .filter(u => u && u.id)
                        .filter(u => userIds.includes(u.id) === false)
                        .map((account) => {
                            return (
                                <Account 
                                    key={account.id}
                                    isEditable={true}
                                    account={account}
                                />
                            )
                        })}
                </div>
            </div>}
        </div>
    );
};

export default Friends;