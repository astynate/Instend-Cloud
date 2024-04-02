import React from 'react';
import styles from './main.module.css';

const File = (props) => {

  if (props.isPlaceholder === true) {

    return (
      <div className={styles.wrapper}>
        <div className={styles.content} id="placeholder">

        </div>
      </div>
    );

  } else {

    return (
      <div className={styles.wrapper} onContextMenu={props.onContextMenu}>
        <div className={styles.content}>
          {props.image != null ? 
          <div className={styles.imageWrapper}>
            <img 
              src={`data:image/png;base64,${props.image}`} 
              className={styles.image}
              draggable={false}
            />
          </div>
          : 
            <div className={styles.file}>
              <span>{props.type}</span>
            </div>}
        </div>
        <div className={styles.description}>
          <span className={styles.name}>{props.name}</span>
          <span className={styles.time}>{props.time}</span>
        </div>
      </div>
    );

  }
  
};

export default File;