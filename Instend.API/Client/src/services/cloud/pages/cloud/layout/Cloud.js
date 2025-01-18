import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper.jsx';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton.js';
import share from './images/header/account.png';
import download from './images/header/download.png';
import sort from './images/header/sort.png';
import MainCloudPage from '../pages/main/MainCloudPage.jsx';
import PublicationsCloudPage from '../pages/publications/PublicationsCloudPage.jsx';
import MessagesCloudPage from '../pages/messages/MessagesCloudPage.jsx';
import CloudHeader from '../widgets/cloud-header/CloudHeader.js';
import OpenAccessProcess from '../../../process/open-access/OpenAccessProcess.js';

const Cloud = observer(({setPanelState}) => {
  const [isAccessProcessWindowOpen, setAccessProcessWindowState] = useState(false);
  const selectPlaceWrapper = useRef();

  useEffect(() => {
    if (setPanelState) {
      setPanelState(false); 
    }
  }, [setPanelState]);

  return (
    <div className={styles.wrapper} ref={selectPlaceWrapper}>
      <Header>
        <Search />
        <SubMenu 
          items={[
            { name: 'Main', route: '/cloud' },
            { name: 'Publications', route: '/cloud/publications' },
            { name: 'Messages', route: '/cloud/messages' },
          ]}
        />
      </Header>
      <ContentWrapper>
        <div className={styles.header}>
            <UnitedButton
                buttons={[{ 
                    label: 'Open access', 
                    image: <img src={share} draggable="false" />,
                    callback: () => setAccessProcessWindowState(p => !p) 
                }]}
            />
            {/* <UnitedButton
                buttons={[
                  { 
                    label: 'Download', 
                    image: <img src={download} draggable="false" /> 
                  },
                  { 
                    label: 'Name', 
                    image: <img src={sort} draggable="false" /> 
                  },
                ]}
            /> */}
        </div>
      </ContentWrapper>
      {isAccessProcessWindowOpen && <OpenAccessProcess 
          isOpen={isAccessProcessWindowOpen}
          close={() => setAccessProcessWindowState(false)}
      />}
      <CloudHeader />
      <Routes>
        <Route path=":id?" element={<MainCloudPage />} />
        <Route path="/publications/:id?" element={<PublicationsCloudPage />} />
        <Route path="/messages/:id?" element={<MessagesCloudPage />} />
      </Routes>
    </div>
  );
});

export default Cloud;