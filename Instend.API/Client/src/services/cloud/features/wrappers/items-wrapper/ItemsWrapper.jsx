import React from 'react';
import styles from './main.module.css';

const ItemsWrapper = ({ children, isNoWrap = false }) => {
  return (
    <div className={isNoWrap ? styles.itemsNoWrap : styles.items}>
      {children}
    </div>
  );
};

export default ItemsWrapper;