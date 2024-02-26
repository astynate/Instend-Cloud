import React from 'react';
import styles from './styles/main.module.css';
import Avatar from '../../shared/avatar/Avatar';
import Username from '../../shared/username/Username';
import Data from '../../shared/data/Data';
import Navigation from '../navigation/Navigation';
import { observer } from 'mobx-react-lite';
import userState from '../../../../../../states/user-state';

const Description = observer(() => {

  const { user } = userState;

  return (

    <>
      <div className={styles.description}>
        <Avatar src={`data:image/png;base64,${user.avatar}`} />
        <div className={styles.profileDescription}>
          <Username username={user.nickname} />
          <Data coins={user.balance} friends={user.friendCount} space={user.storageSpace / 1024} />
          <div><h3 className={styles.name}>{user.name} {user.surname}</h3></div>
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

});

export default Description;