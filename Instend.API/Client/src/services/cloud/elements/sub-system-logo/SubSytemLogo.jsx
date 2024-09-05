import styles from './main.module.css';
import logo from './logo.png';

const SubSystemLogo = ({title}) => {
    return (
        <div className={styles.subSystemLogo}>
            <img src={logo} draggable="false" />
            <span>Yexider&nbsp;</span>
            <span>{title}</span>
        </div>
    );
}

export default SubSystemLogo;