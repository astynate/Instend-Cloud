import Account from '../../widgets/account/Account';
import styles from './main.module.css';

const InviteAccounts = ({manageCallback = () => {}}) =>{
    return (
        <>
            <div className={styles.header}>
                <span className={styles.title}>You can invite  up to 30 users.</span>
                <span className={styles.link} onClick={manageCallback}>Manage invitations</span>
            </div>
            <div className={styles.people}>
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
                <Account />
            </div>
        </>
    );
};

export default InviteAccounts;