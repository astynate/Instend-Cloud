import React, { useState } from 'react';
import styles from './main.module.css';

const ElementBar = (props) => {
    return (
        <div className={styles.menu}>
            <div className={styles.elements}>
                {Object.keys(props.elements).map(key => {
                    return (
                        <div 
                            key={key} 
                            className={styles.button} 
                            id={key === props.current ? 'active' : null}
                            onClick={() => props.setCurrent(key)}
                        >
                            <span>
                                {key}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
 };

export default ElementBar;