import React from 'react';
import LayoutHeader from '../../../widgets/header/Header';
import Header from '../shared/header/Header';
import styles from './styles/main.module.css';
import Description from '../widgets/description/Description';
import Search from '../../../features/search/Search';

const Profile = () => {

  return (

    <div className={styles.content}>
      <LayoutHeader>
        <Search />
      </LayoutHeader>
      <div className={styles.wrapper}>
        <Header />
        <Description />
      </div>
    </div>

  )

}

export default Profile;