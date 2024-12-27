import React from 'react';
import styles from './styles/main.module.css';
import Base64Handler from '../../../../../utils/handlers/Base64Handler';

const Avatar = ({avatar}) => {
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatar}>
          {avatar &&<img 
              src={Base64Handler.Base64ToUrlFormatPng(avatar)} 
              className={styles.avatarImage} 
              draggable="false" 
          />}
      </div>
    </div>
  );
};

export default Avatar;