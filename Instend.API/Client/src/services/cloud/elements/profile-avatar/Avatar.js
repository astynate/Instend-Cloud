import React from 'react';
import styles from './styles/main.module.css';

const Avatar = (props) => {
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatar} id={props.isLoading ? 'loading' : null}>
          {props.src &&
            <img 
              src={`data:image/png;base64,${props.src}`} 
              className={styles.avatarImage} 
              draggable="false" 
            />}
      </div>
    </div>
  );
}

export default Avatar;