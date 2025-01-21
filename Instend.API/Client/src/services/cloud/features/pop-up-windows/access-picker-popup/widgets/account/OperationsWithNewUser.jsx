import { useContext, useState } from 'react';
import SelectRoles from '../select-roles/SelectRoles';
import styles from './main.module.css';
import { OpenAccessContext } from '../../../../../process/open-access/OpenAccessProcess';

const OperationsWithNewUser = ({account}) => {
    const [role, setRole] = useState(0);
    const context = useContext(OpenAccessContext);

    const addAccount = () => {
        if (!!account === false) {
            return false;
        };

        if (!!context.item === false) {
            return false;
        };

        context.setSavedState(false);

        const newAccounts = {
            account: account,
            accountId: account.id,
            itemId: context.item.id,
            role: role,
        };

        context.setUsers(prev => {
            return [...prev, newAccounts];
        })
    };
    
    return (
        <>
            <SelectRoles
                isEditable={true}
                value={role}
                setValue={setRole}
                items={['Viewer', 'Editor', 'Owner']}
            />
            <button 
                className={`${styles.button} ${styles.blue}`}
                onClick={addAccount}
            >
                Invite
            </button>
        </>
    );
};

export default OperationsWithNewUser;