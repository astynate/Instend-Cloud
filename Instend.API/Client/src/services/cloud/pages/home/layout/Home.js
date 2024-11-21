import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import News from '../pages/news/News';
import MainContentWrapper from '../../../features/wrappers/main-content-wrapper/MainContentWrapper';
import PublicationPage from '../../publication/PublicationPage';

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
      <div className={styles.headerWrapper}>
        <MainContentWrapper>
          <div className={styles.header}>
            <SubMenu 
              items={[
                {'name': 'News', 'route': '/'},
                {'name': 'People', 'route': '/people'}
              ]}
            />
            <div className={styles.overlay}>
              <div className={styles.circle}></div>
            </div>
            <div className={styles.overlay}>
              <div className={styles.circle}></div>
            </div>
          </div>
        </MainContentWrapper>
      </div>
      <Routes>
        <Route path='' element={<News />} />
        <Route path='/publication' element={<PublicationPage />} />
      </Routes>
    </div>
  );
});

export default Home;