import styles from './main.module.css';
import mainStyles from '../../styles/main.module.css';
import back from './images/back.png';

const PopUpWithBackButton = ({title, close = () => {}, children}) => {
    const ReturnToThePreveiousPage = (event) => {
        event.preventDefault();
        event.stopPropagation();

        close();
    }

    return (
        <div className={mainStyles.miniProfile}>
            <div className={styles.header}>
                <button onClick={ReturnToThePreveiousPage}>
                    <img src={back} draggable="false" />
                </button>
                <span>{title}</span>
            </div>
            <hr />
            {children}
        </div>
    );
}

export default PopUpWithBackButton;