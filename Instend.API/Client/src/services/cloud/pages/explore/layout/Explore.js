import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import ExploreState from '../../../../../state/entities/ExploreState';
import AccountState from '../../../../../state/entities/AccountState';
import User from '../../../components/user/User';
import SearchField from '../../../ui-kit/fields/search-field/SearchField';
import SearchHandler from '../../../../../handlers/SearchHandler';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper';
import Slider from '../../../widgets/slider/Silder';
import Collection from '../../../components/collection/Collection';
import File from '../../../components/file/File';
import FilesController from '../../../api/FilesController';
import CollectionsController from '../../../api/CollectionsController';
import FriendsController from '../../../api/FriendsController';

const Explore = observer(({isMobile = false, setPanelState = () => {}}) => {
  const { files } = ExploreState;
  const { collections } = ExploreState;
  const { accounts } = ExploreState;
  const { friends } = ExploreState;

  useEffect(() => {
    if (setPanelState) {
      setPanelState(false);
    };
  }, [setPanelState]);

  const isAccountCorrect = (account) => {
    return !account || !account.id || account.id !== AccountState.account.id;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (friends.length === 0) {
        await FriendsController.GetFriendsById(AccountState.account.id, ExploreState.setFriends);
      };
      
      if (collections.length === 0) {
        await CollectionsController.GetLastCollections(10, 0, ExploreState.setCollections);
      };

      if (files.length === 0) {
        await FilesController.GetLastFilesWithType(10, 0, undefined, ExploreState.setFiles);
      };
    };

    fetchData();
  }, [files, collections]);

  return (
    <div className={styles.explore}>
      {!isMobile && <Header>
        <Search title="Explore" isMovable={true} />
      </Header>}
      {isMobile && <div className={styles.mobileSearch}>
        <SearchField placeholder='Search in Instend' callback={SearchHandler.SearchAll} />
      </div>}
      <ContentWrapper>
        <Slider title='People'>
          {accounts.filter(x => isAccountCorrect(x)).length > 0 &&
              accounts.map(account => {
                return <User key={account.id} user={account} />;
              }
            )}
        </Slider>
        <br />
        <Slider title='Friends'>
          {friends.map(account => {
                return <User key={account.id} user={account} />;
              }
            )}
        </Slider>
        <br />
        <Slider title='Collections' isIterated={true}>
          <>
            {collections
              .filter(collection => collection.typeId !== 'System')
              .map(collection => {
                  return <Collection key={collection.id} collection={collection} />
              })}
          </>
          <>
            {files
              .map(file => {
                  return <File key={file.id} file={file} />;
              })}
          </>
        </Slider>
      </ContentWrapper>
    </div>
  );
});

export default Explore;