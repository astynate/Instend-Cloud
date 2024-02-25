import React from 'react';
import styles from './styles/main.module.css';
import Avatar from '../../shared/avatar/Avatar';
import Username from '../../shared/username/Username';
import Data from '../../shared/data/Data';
import Navigation from '../navigation/Navigation';

const Description = () => {

  return (

    <>
      <div className={styles.description}>
        <Avatar />
        <div className={styles.profileDescription}>
          <Username />
          <Data coins={0} friends={0} space={1} />
          <div><h3 className={styles.name}>Name Surname</h3></div>
        </div>
        <div className={styles.editProfile}>
          <div>
            <button className={styles.editProfileButton}>
              Edit profile
            </button>
          </div>
          <div>
            <button className={styles.editProfileButton}>
              Settings
            </button>
          </div>
        </div>
      </div>
      <Navigation />
    </>

  )

};

export default Description;