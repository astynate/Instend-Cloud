import { Link } from 'react-router-dom';
import styles from './main.module.css';
import back from './images/back.png';

const BackButton = ({location, title}) => {
    return (
        <div className={styles.button}>
            <Link to={location}>
                <img src={back} draggable="false" />
            </Link>
            <span>{title}</span>
        </div>
    );
};

export default BackButton;