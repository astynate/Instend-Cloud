import React from 'react';
import styles from './main.module.css';

const LoaderButton = (props) => {

    return (
        <button 
            className={styles.button}
            disabled={props.state != 'valid'} 
            onClick={props.onClick}
            id={props.state}
        >
            {props.title}
            <div className={styles.buttonLoaderWrapper} id={props.state}>
                <div className={styles.buttonLoader}>
                    {Array(12).fill(0).map((_, index) => (
                        (<div key={index}></div>)
                    ))}
            </div>
        </div>
        </button>
    );

}

export default LoaderButton;