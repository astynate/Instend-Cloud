import React from 'react';
import styles from './styles/main.module.css';

const Data = ({isLoading, stats}) => {
  return (
    <div className={styles.data}>
        {stats && stats.map((element, index) => {
          if (isLoading) {
            return (<div className={styles.placeholder}></div>)
          } else {
            return (
              <div className={styles.counter} key={index}>
                <h2>{element.amount}</h2>
                <span>{element.title}</span>
              </div>
            )
          }
        })}
    </div>
  )
}

export default Data;