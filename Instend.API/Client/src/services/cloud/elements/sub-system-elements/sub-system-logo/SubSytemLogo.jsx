import styles from './main.module.css';
import logo from './logo.png';

const SubSystemLogo = ({icon, title, subTitle}) => {
    return (
        <div className={styles.subSystemLogo}>
            <img src={icon ?? logo} draggable="false" />
            <span>{title ?? 'Instend'}&nbsp;</span>
            <span>{subTitle ?? ""}</span>
        </div>
    );
};

export default SubSystemLogo;