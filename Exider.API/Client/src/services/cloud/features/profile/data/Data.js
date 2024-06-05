import React from 'react';
import styles from './styles/main.module.css';

const Data = ({stats}) => {
  return (
    <div className={styles.data}>
        {stats && stats.map((element, index) => {
          return (
            <div className={styles.counter} key={index}>
              <h2>{element.amount}</h2>
              <span>{element.title}</span>
            </div>
          )
        })}
    </div>
  )
}

export default Data;