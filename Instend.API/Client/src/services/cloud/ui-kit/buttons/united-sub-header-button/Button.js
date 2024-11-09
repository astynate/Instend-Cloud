import React from "react";
import styles from './main.module.css';

const Button = ({onClick, forwardRef, img, title}) => {
    return (
      <div className={styles.button} onClick={onClick} ref={forwardRef}>
        <img src={img} />
        <span>{title}</span>
      </div>
    )
};
  
export default Button;