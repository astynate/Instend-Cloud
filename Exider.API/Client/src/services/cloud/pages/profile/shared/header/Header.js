import React from 'react';
import styles from './styles/main.module.css';

const Header = (props) => {

  if (props.src) {

    return (

      <div className={styles.header}>
        <img src={`data:image/png;base64,${props.src}`}  draggable={false} /> 
      </div>
  
    );

  }

};

export default Header;