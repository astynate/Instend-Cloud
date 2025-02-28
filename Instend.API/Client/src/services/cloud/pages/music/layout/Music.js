import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import Songs from '../pages/songs/Songs';

const Music = ({setPanelState, isMobile}) => {
  const scroll = useRef();

  useEffect(() => {
    if (setPanelState) 
      setPanelState(false);
  }, [setPanelState]);

  return (
    <div className={styles.music} ref={scroll}>
      {isMobile === false && 
        <Header>
          <Search />
        </Header>}
      <div className={styles.header}>
        <SubMenu 
          items={[
            {
              'name': 'Songs', 
              'route': '/music'
            }, 
            {
              'name': 'Playlists', 
              'route': '/music/playlists'
            }
          ]}
        />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route 
            path=''
            element={<Songs isMobile={isMobile} />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default Music;