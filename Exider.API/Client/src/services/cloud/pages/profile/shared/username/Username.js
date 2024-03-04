import React from 'react';
import styles from './styles/main.module.css';

const Username = (props) => {

  return (

    <div className={styles.wrapper}>
      <h1 className={styles.username}>{props.username}</h1>
      {props.children}
    </div>

  )

}

export default Username;