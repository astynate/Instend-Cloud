import GlobalContext from '../../../../../../../global/GlobalContext';
import styles from './main.module.css';

const ViewOnly = ({role}) => {
    if (!role) {
        return null;
    }

    return (
        <div className={styles.role}>
            <span className={styles.state}>{GlobalContext.roles[role.role].name}</span>
        </div>
    );
};

export default ViewOnly;