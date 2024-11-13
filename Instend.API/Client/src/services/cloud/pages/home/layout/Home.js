import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
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
        <SubMenu 
          items={[
            {'name': 'News', 'route': '/'},
            {'name': 'Communities', 'route': '/communities'}, 
            {'name': 'People', 'route': '/people'}
          ]}
        />
      </div>
      <Routes>
        <Route path='' element={<News />} />
        {/* <Route path='/communities' element={<Communities />} />
        <Route path='/community/:id' element={<Community isMobile={props.isMobile} />} />
        <Route path='/people' element={<People />} /> */}
      </Routes>
    </div>
  );
});

export default Home;