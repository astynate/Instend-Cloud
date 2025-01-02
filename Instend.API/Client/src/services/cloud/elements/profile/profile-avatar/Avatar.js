import React from 'react';
import styles from './styles/main.module.css';
import StorageController from '../../../../../api/StorageController';

const Avatar = ({avatar}) => {
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatar}>
          {avatar && <img 
              src={StorageController.getFullFileURL(avatar)}
              className={styles.avatarImage} 
              draggable="false" 
          />}
      </div>
    </div>
  );
};

export default Avatar;