import * as React from 'react';
import styles from './main.module.css';
import add from './images/add.png';
import sub from './images/sub.png';

const Range = (props) => {
    return (
        <div className={styles.rangeWrapper}>
            <img 
                src={sub} 
                className={styles.button} 
                onClick={() => props.setValue(prev => {
                    if (prev - props.inc >= props.min) {
                        return prev - props.inc
                    }

                    return prev;
                })} 
            />
            <input type='range' 
                id="range"
                name="range"
                className={styles.range} 
                min={props.min} 
                max={props.max} 
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
            />
            <img 
                src={add} 
                className={styles.button}
                onClick={() => props.setValue(prev => {
                    if (prev + props.inc <= props.max) {
                        return prev + props.inc
                    }

                    return prev;
                })} 
            />
        </div>
    );
};

export default Range;
