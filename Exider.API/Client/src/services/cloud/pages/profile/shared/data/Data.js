import React from 'react';
import styles from './styles/main.module.css';

const Data = (props) => {

  return (

    <div className={styles.data}>
        <div className={styles.counter}>
            <h2>{props.coins}</h2>
            <span>Coins</span>
        </div>
        <div className={styles.counter}>
            <h2>{props.friends}</h2>
            <span>Friends</span>
        </div>
        <div className={styles.counter}>
            <h2>{props.space}</h2>
            <span>GB</span>
        </div>
    </div>

  )

}

export default Data;