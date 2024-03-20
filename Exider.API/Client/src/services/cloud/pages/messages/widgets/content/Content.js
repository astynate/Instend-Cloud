import React from 'react';
import styles from './main.module.css';

const Content = (props) => {

    return (

        <div className={styles.wrapper}>
            {props.children}
        </div>

    );

};

export default Content;