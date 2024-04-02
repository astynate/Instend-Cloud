import React from "react";
import styles from './main.module.css';

const Button = (props) => {
    return (
      <div className={styles.button} onClick={props.onClick} ref={props.forwardRef}>
        <img src={props.img} />
        <span>{props.title}</span>
      </div>
    )
  };
  
  export default Button;