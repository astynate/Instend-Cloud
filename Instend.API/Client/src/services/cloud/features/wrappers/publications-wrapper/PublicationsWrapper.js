import React from 'react';
import styles from './main.module.css';

const PublicationsWrapper = ({children}) => {
    return (
        <div className={styles.wrapper}>
            {(children)}
        </div>
    );
};

export default PublicationsWrapper;