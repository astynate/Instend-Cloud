import React, { useState } from 'react';
import styles from './main.module.css';

const ElementBar = (props) => {
    return (
        <div className={styles.menu}>
            <div className={styles.elements}>
                {Object.keys(props.elements).map(key => {
                    return (
                        <>
                            <div key={key} className={styles.button} id={key === props.current ? 'active' : null}>
                                <span>
                                    {key}
                                </span>
                            </div>
                        </>
                    )
                })}
            </div>
            <div className={styles.content}>
                {props.elements[props.current]}
            </div>
        </div>
    );
 };

export default ElementBar;