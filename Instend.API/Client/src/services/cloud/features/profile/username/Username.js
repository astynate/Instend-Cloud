import React from 'react';
import styles from './styles/main.module.css';

const Username = ({isLoading, username, children}) => {
  if (isLoading === true) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.placeholder}></div>
      </div>
    )
  } else {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.username}>{username}</h1>
        {children}
      </div>
    )
  }
}

export default Username;