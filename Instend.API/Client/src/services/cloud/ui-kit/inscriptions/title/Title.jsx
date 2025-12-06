import React from 'react';
import styles from './main.module.css';

const Title = ({text=""}) => {
  return (
    <h1 className={styles.title}>{text}</h1>
  );
};

export default Title;