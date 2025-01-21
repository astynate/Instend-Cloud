import { useEffect, useState } from 'react';
import StorageController from '../../../../../../../api/StorageController';
import GlobalIcons from '../../../../../../../global/GlobalIcons';
import styles from './main.module.css';
import ViewOnly from './ViewOnly';
import OperationsWithAnExistingUser from './OperationsWithAnExistingUser';
import OperationsWithNewUser from './OperationsWithNewUser';

const Account = ({isEditable = false, account, role, setUsers = () => {}, setFoundUsers = () => {}}) => {
    const [current, setCurrent] = useState(0);

    const handlers = [
        <ViewOnly role={role} />, 
        <OperationsWithAnExistingUser 
            account={account}
            role={role}
            setUsers={setUsers}
            setFoundUsers={setFoundUsers}
        />,
        <OperationsWithNewUser 
            role={role}
            account={account}
            setUsers={setUsers}
            setFoundUsers={setFoundUsers}
        />
    ];
    
    useEffect(() => {
        if (role) {
            setCurrent(isEditable ? 1 : 0);
            return;
        }

        setCurrent(isEditable ? 2 : 0);
    }, [account]);

    if (!account) {
        return null;
    }

    return (
        <div className={styles.account} editable={isEditable ? 'true' : ''} new={!role ? 'true' : ''}>
            <img 
                src={StorageController.getFullFileURL(account.avatar) ?? GlobalIcons.defaultAvatar} 
                className={styles.avatar}
                draggable="false" 
            />
            <div className={styles.information}>
                <span className={styles.name}>{account.name} {account.surname}</span>
                {handlers[current]}
            </div>
        </div>
    );
};

export default Account;