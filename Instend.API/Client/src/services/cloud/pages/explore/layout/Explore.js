import React, { useEffect } from 'react';
import { ConvertBytesToMb } from '../../../../../utils/handlers/StorageSpaceHandler';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubContentWrapper from '../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import ExploreState from '../../../../../state/entities/ExploreState';
import AccountState from '../../../../../state/entities/AccountState';
import User from '../../../components/user/User';

const Explore = observer((props) => {
  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false);
    }
  }, [props.setPanelState]);

  const isAccountCorrect = (account) => {
    return !account || !account.id || account.id !== AccountState.account.id;
  }

  return (
    <div className={styles.explore}>
      <Header />
      <Search 
        isMovable={true} 
      />
      <div className={styles.searchButtons}>

      </div>
      {ExploreState.accounts.filter(x => isAccountCorrect(x)).length > 0 && <SubContentWrapper>
        <div className={styles.itemsWrapper}>
          <h1>People</h1>
          <div className={styles.items}>
            {ExploreState.accounts.map(account => {
                if (isAccountCorrect(account) === false) {
                  return null;  
                }

                return (
                  <div key={account.id} className={styles.item}>
                    <User
                        id={account.id}
                        avatar={account.avatar}
                        nickname={account.nickname}
                        name={`${account.name} ${account.surname}`}
                        coins={account.balance}
                        friends={account.friendCount}
                        space={ConvertBytesToMb(account.storageSpace)}
                    />
                  </div>
                );
            })}
          </div>
        </div>
      </SubContentWrapper>}
    </div>
  );
});

export default Explore;