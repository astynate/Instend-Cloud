import React from 'react';
import styles from './styles/main.module.css';

const Username = (props) => {

  return (

    <div>
      <h1 className={styles.username}>{props.username}</h1>
    </div>

  )

}

export default Username;