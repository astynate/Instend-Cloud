import React, { useEffect } from 'react';
import { ConvertBytesToMb } from '../../../../../handlers/StorageSpaceHandler';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubContentWrapper from '../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import ExploreState from '../../../../../state/entities/ExploreState';
import AccountState from '../../../../../state/entities/AccountState';
import User from '../../../components/user/User';
import SearchField from '../../../ui-kit/fields/search-field/SearchField';
import SearchHandler from '../../../../../handlers/SearchHandler';

const Explore = observer(({isMobile = false, setPanelState = () => {}}) => {
  useEffect(() => {
    if (setPanelState) {
      setPanelState(false);
    };
  }, [setPanelState]);

  const isAccountCorrect = (account) => {
    return !account || !account.id || account.id !== AccountState.account.id;
  };

  return (
    <div className={styles.explore}>
      {!isMobile && <Header>
        <Search isMovable={true} />
      </Header>}
      {isMobile && <div className={styles.mobileSearch}>
        <SearchField placeholder='Search in Instend' callback={SearchHandler.SearchAll} />
      </div>}
      {ExploreState.accounts.filter(x => isAccountCorrect(x)).length > 0 && <SubContentWrapper>
        <div className={styles.itemsWrapper}>
          <div className={styles.items}>
            {ExploreState.accounts.map(account => {
                if (isAccountCorrect(account) === false) {
                  return null;  
                };

                return (
                  <User
                      key={account.id}
                      id={account.id}
                      avatar={account.avatar}
                      nickname={account.nickname}
                      name={`${account.name} ${account.surname}`}
                      coins={account.balance}
                      friends={account.friendCount}
                      space={ConvertBytesToMb(account.storageSpace)}
                  />
                );
            })}
          </div>
        </div>
      </SubContentWrapper>}
    </div>
  );
});

export default Explore;