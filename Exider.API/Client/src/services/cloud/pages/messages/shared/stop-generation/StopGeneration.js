import styles from './main.module.css';

const StopGeneration = (props) => {

    return (

        <div className={styles.stopGenerationWrapper} onClick={props.onClick}>
            <div className={styles.stopGeneration}>
            <div className={styles.loader}></div>
                Stop generation
            </div>
        </div>

    );

};

export default StopGeneration;