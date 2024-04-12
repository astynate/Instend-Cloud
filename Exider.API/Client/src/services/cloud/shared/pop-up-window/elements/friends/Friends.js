import React from 'react';
import styles from './main.module.css';

const Friends = (props) => {

    return (
        <div className={styles.friends}>
            {
                Array.from({length: 20}).map((_, index) =>
                    <div className={styles.friend} key={index}>
                        <div className={styles.avatar}>

                        </div>
                        <div className={styles.description}>
                            <span className={styles.username}>asdadadadadadasdadasd</span>
                            <span className={styles.fullname}>asdadadadadadasdadasd</span>
                        </div>
                        <div className={styles.select}>
                            {props.children}
                        </div>
                    </div>
                )
            }
        </div>
    );

};

export default Friends;