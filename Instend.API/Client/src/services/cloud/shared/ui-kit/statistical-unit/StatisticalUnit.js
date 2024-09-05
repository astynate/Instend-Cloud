import React from 'react';
import styles from './main.module.css';

const StatisticalUnit = ({title, amount}) => {
    return (
        <span className={styles.statisticalUnit}>
            <span className={styles.amount}>
                {amount}
            </span>
            {title}
        </span>
    )
}

export default StatisticalUnit;