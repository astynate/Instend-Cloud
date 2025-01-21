import { useContext } from 'react';
import { OpenAccessContext } from '../../../../../process/open-access/OpenAccessProcess';
import SelectRoles from '../select-roles/SelectRoles';
import styles from './main.module.css';

const OperationsWithAnExistingUser = ({role}) => {
    const context = useContext(OpenAccessContext);

    const setRole = (value) => {
        context.setUsers(prev => {
            if (prev.length < 2) {
                return prev;
            }

            const numberOfOwners = prev.filter(e => e.role === 2).length;
            const isCurrentRoleIsOwner = role.role === 2;

            if (numberOfOwners < 2 && isCurrentRoleIsOwner) {
                return prev;
            }

            context.setSavedState(false);

            return prev.map((user) => {
                if (user.accountId === role.account.id) {
                    user.role = value;
                }

                return user;
            });
        })
    }

    const removeAccount = () => {
        if (context.users.length < 2) {
            return;
        }

        if (role.role === 2) {
            return;
        }

        context.setSavedState(false);

        context.setUsers(prev => prev
            .filter(u => u.accountId !== role.accountId));
    }

    return (
        <>
            <SelectRoles 
                isEditable={true}
                value={role.role}
                setValue={setRole}
                items={['Viewer', 'Editor', 'Owner']}
            />
            <button 
                onClick={removeAccount}
                className={`${styles.button} ${styles.red}`}
            >
                Remove
            </button>
        </>
    );
};

export default OperationsWithAnExistingUser;