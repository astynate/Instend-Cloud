import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper.jsx';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton.js';
import share from './images/header/account.png';
import MainCloudPage from '../pages/main/MainCloudPage.jsx';
import PublicationsCloudPage from '../pages/publications/PublicationsCloudPage.jsx';
import MessagesCloudPage from '../pages/messages/MessagesCloudPage.jsx';
import CloudHeader from '../widgets/cloud-header/CloudHeader.js';
import OpenAccessProcess from '../../../process/open-access/OpenAccessProcess.js';
import CollectionsController from '../../../api/CollectionsController.js';
import AccountController from '../../../../../api/AccountController.js';
import AccessController from '../../../api/AccessController.js';
import download from './images/header/download.png';
import sort from './images/header/sort.png';
import arrow from './images/header/arrow.png';
import PopUpSelectOneOfList from '../../../shared/popup-windows/pop-up-select-one-of-list/PopUpSelectOneOfList.jsx';

const Cloud = observer(({setPanelState}) => {
  const [isSortWindowOpen, setSortWindowOpenState] = useState(false);
  const [isAccessProcessWindowOpen, setAccessProcessWindowState] = useState(false);
  const [isAscending, setAscendingState] = useState(true);
  const [sortingType, setSortingType] = useState(0);
  const selectPlaceWrapper = useRef();

  let params = useParams();

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
      <PopUpSelectOneOfList 
        isOpen={isSortWindowOpen}
        buttons={[
          { title: 'Date', callback: () => setSortingType(0) },
          { title: 'Name', callback: () => setSortingType(1) },
        ]}
        setOpenState={setSortWindowOpenState}
      />
      <ContentWrapper>
        <div className={styles.header}>
            <div className={styles.accessButton} id={!!params['*'] ? '' : 'disabled'} >
              <UnitedButton
                  isAccent={true}
                  buttons={[{ 
                      label: 'Open access', 
                      image: <img src={share} draggable="false" />,
                      callback: () => setAccessProcessWindowState(p => !p && !!params['*']) 
                  }]}
              />
            </div>
            <div className={styles.rightButtons}>
              <UnitedButton
                  buttons={[
                    { 
                      label: '', 
                      image: <img src={arrow} draggable="false" id={isAscending ? '' : 'reversed'} />,
                      callback: () => setAscendingState(p => !p)
                    },
                  ]}
              />
              <UnitedButton
                  buttons={[
                    { 
                      label: 'Download', 
                      image: <img src={download} draggable="false" />,
                      callback: () => CollectionsController.DownloadCollection(params.id)
                    },
                    { 
                      label: sortingType === 0 ? 'Date' : 'Name', 
                      image: <img src={sort} draggable="false" />,
                      callback: () => setSortWindowOpenState(true)
                    },
                  ]}
              />
            </div>
        </div>
      </ContentWrapper>
      {isAccessProcessWindowOpen && <OpenAccessProcess 
          isOpen={isAccessProcessWindowOpen}
          close={() => setAccessProcessWindowState(false)}
          getItem={(onSucces, onError) => CollectionsController.GetCollectionById(params['*'], onSucces, onError)}
          fetchData={AccountController.GetAccountsByPrefix}
          sendAccessRequest={(access, roles, onSucces) => AccessController.UpdateCollectionAccess(params['*'], access, roles, onSucces)}
      />}
      <CloudHeader />
      <Routes>
        <Route path=":id?" element={<MainCloudPage sortingType={sortingType} isAscending={isAscending} />} />
        <Route path="/publications/:id?" element={<PublicationsCloudPage />} />
        <Route path="/messages/:id?" element={<MessagesCloudPage />} />
      </Routes>
    </div>
  );
});

export default Cloud;