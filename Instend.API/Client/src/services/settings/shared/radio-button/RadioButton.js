import React from 'react';
import external_styles from '../setting/styles/main.module.css';
import styles from './main.module.css';
import check from './check.png';

const RadioButton = (props) => {

    return (

        <div 
            className={styles.radioButton} 
            id={props.active ? 'active' : 'passive'}
            onClick={props.onClick}
        >
            <div className={external_styles.setting} id={props.type}>
                <h1>{props.title}</h1>
                <div className={styles.radio}>
                    {props.active ? <img src={check} className={styles.checkImage} /> : null}
                </div>
            </div>
        </div>
        
    );

};

export default RadioButton;