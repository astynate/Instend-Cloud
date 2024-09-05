import React from 'react';
import styles from './main.module.css';

const ExploreItems = ({children}) => {
    return (
        <div className={styles.exploreItems}>
            {(children)}
        </div>
    );
 };

export default ExploreItems;