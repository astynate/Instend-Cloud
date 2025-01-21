import StorageController from '../../../../../../../api/StorageController';
import Account from '../../widgets/account/Account';
import styles from './main.module.css';

const InviteAccounts = ({users = [], manageCallback = () => {}}) =>{
    return (
        <>
            <div className={styles.header}>
                <span className={styles.title}>You can invite  up to 30 users.</span>
                <span className={styles.link} onClick={manageCallback}>Manage invitations</span>
            </div>
            <div className={styles.people}>
                {users.map((role) => {
                    return (
                        <Account 
                            key={role.account.id} 
                            account={role.account}
                            role={role}
                        />
                    )
                })} 
            </div>
        </>
    );
};

export default InviteAccounts;