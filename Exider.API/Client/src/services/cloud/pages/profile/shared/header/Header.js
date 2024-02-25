import React from 'react';
import styles from './styles/main.module.css';

const Header = (props) => {

  return (

    <>
      {props.src ?
        <div className={styles.header}>
          <img  src={props.src}  draggable={false} /> 
        </div> 
      : 
        null}
    </>

  );

};

export default Header;