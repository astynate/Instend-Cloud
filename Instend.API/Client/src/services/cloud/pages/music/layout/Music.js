import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import Songs from '../pages/songs/Songs';
import Playlists from '../pages/playlists/Playlists';
import Playlist from '../pages/playlist/Playlist';
import SubContentWrapper from '../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import MainContentWrapper from '../../../features/wrappers/main-content-wrapper/MainContentWrapper';

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
          <Search title="Music" />
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
        </Header>}
      <SubContentWrapper>
        <Routes>
          <Route 
            path=''
            element={<Songs isMobile={isMobile} />} 
          />
          <Route 
            path='/playlists'
            element={<Playlists isMobile={isMobile} />} 
          />
          <Route 
            path='/playlist/:id?'
            element={<Playlist isMobile={isMobile} />} 
          />
        </Routes>
      </SubContentWrapper>
    </div>
  );
};

export default Music;