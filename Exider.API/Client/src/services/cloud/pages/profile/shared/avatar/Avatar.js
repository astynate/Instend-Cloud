import React from 'react';
import styles from './styles/main.module.css';

const Avatar = (props) => {

  return (

    <div className={styles.avatarWrapper}>
      <div className={styles.avatar}>
          {props.src ? <img src={props.src}  className='avatar-image'/> : null} 
          {/* <div className={styles.status}>

          </div> */}
      </div>
    </div>
  )

}

export default Avatar;