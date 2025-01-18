import GlobalIcons from '../../../../../../../global/GlobalIcons';
import styles from './main.module.css';

const Account = ({image}) => {
    return (
        <div className={styles.account}>
            <img 
                src={image ?? GlobalIcons.defaultAvatar} 
                className={styles.avatar}
                draggable="false" 
            />
            <div className={styles.information}>
                <span className={styles.name}>Name</span>
                <span className={styles.state}>state</span>
            </div>
        </div>
    );
};

export default Account;