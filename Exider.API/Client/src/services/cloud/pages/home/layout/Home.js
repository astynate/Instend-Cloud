import React, { useEffect } from 'react';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../features/search/Search';
import Communities from '../pages/communities/Communities';
import People from '../pages/people/People';
import { Route, Routes } from 'react-router-dom';
import Menu from '../../../widgets/menu/Menu';
import { observer } from 'mobx-react-lite';
import Community from '../pages/community/Community';
import MainContentWrapper from '../../../features/main-content-wrapper/MainContentWrapper';
import News from '../pages/news/News';

const Home = observer((props) => {
  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.home}>
      <Header />
      <Search />
      <div className={styles.header}>
        <Menu 
          items={[
            {
              'name': 'News', 
              'route': '/'
            },
            {
              'name': 'Communities', 
              'route': '/communities'
            }, 
            {
              'name': 'Top users', 
              'route': '/people'
            }
          ]}
        />
      </div>
      <Routes>
        <Route path='' element={<News />} />
        <Route path='/communities' element={<Communities />} />
        <Route path='/community/:id' element={<Community isMobile={props.isMobile} />} />
        <Route path='/people' element={<People />} />
      </Routes>
    </div>
  )
});

export default Home;