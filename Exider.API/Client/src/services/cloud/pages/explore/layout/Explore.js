import React, { useEffect } from 'react';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../features/search/Search';
import { Route, Routes } from 'react-router-dom';
import Menu from '../../../widgets/menu/Menu';
import All from '../pages/all/All';
import People from '../pages/people/People';

const Explore = (props) => {
  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.explore}>
      <Header />
      <Search />
      <div className={styles.header}>
        <Menu 
          items={[
            {
              'name': 'All', 
              'route': '/explore'
            }, 
            {
              'name': 'People', 
              'route': '/explore/people'
            }
          ]}
        />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route 
            path=''
            element={<All />} 
          />
          <Route 
            path='/people' 
            element={<People />} 
          />
        </Routes>
      </div>
    </div>
  )
}

export default Explore;