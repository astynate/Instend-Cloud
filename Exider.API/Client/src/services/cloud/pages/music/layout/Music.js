import React, { useEffect } from 'react';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../features/search/Search';
import Menu from '../../../widgets/menu/Menu';
import { Route, Routes } from 'react-router-dom';
import Songs from '../pages/Songs/Songs';
import Playlists from '../pages/Playlists/Playlists';

const Music = (props) => {
  useEffect(() => {
    if (props.setPanelState) { props.setPanelState(false); }
  }, [props.setPanelState]);

  return (
    <div className={styles.music}>
      {props.isMobile === false && 
        <>
          <Header>
            <Search />
          </Header>
        </>
      }
      <div className={styles.header}>
        <Menu 
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
      <Routes>
        <Route 
          path=''
          element={<Songs />} 
        />
        <Route 
          path='/playlists'
          element={<Playlists />} 
        />
      </Routes>
    </div>
  )
}

export default Music;