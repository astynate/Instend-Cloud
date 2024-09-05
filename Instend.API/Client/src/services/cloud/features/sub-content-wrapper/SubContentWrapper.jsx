import React from 'react';
import styles from './main.module.css';

const SubContentWrapper = ({children}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                {(children)}
            </div>
        </div>
    );
}

export default SubContentWrapper;