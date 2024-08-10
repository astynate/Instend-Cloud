import styles from './main.module.css';

const MainMessageButton = ({image, callback = () => {}}) => {
    return (
        <button className={styles.button} onClick={callback}>
            <img src={image} />
        </button>
    );
}

export default MainMessageButton;