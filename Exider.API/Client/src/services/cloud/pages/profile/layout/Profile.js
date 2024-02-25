import React from 'react';
import Header from '../shared/header/Header';
import styles from './styles/main.module.css';
import Description from '../widgets/description/Description';

const Profile = () => {

  return (

    <div className={styles.wrapper}>
      <Header />
      <Description />
    </div>

  )

}

export default Profile;