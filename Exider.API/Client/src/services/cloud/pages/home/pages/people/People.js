import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Loader from '../../../../shared/loader/Loader';
import { instance } from '../../../../../../state/Interceptors';
import User from '../../../explore/features/user/User';
import { ConvertBytesToMb } from '../../../../../../utils/handlers/StorageSpaceHandler';
import SubContentWrapper from '../../../../features/sub-content-wrapper/SubContentWrapper';

const People = () => {
  const [isLoading, setLoadingState] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      await instance.get('/accounts/popular')
        .then(response => {
          if (response && response.data && response.data.length) {
            setUsers(response.data);
            setLoadingState(false);
          }
        })
    })();
  }, []);

  return (
    <SubContentWrapper>
      <div className={styles.home}>
        {isLoading === true ? 
          <div className={styles.placeholder}>
            <Loader />
          </div>
        : 
          <div className={styles.users}>
              {users.map((element, index) => {
                return (
                  <User 
                    key={index} 
                    id={element.id}
                    avatar={element.avatar}
                    nickname={element.nickname}
                    name={`${element.name} ${element.surname}`}
                    coins={element.balance}
                    friends={element.friendCount}
                    space={ConvertBytesToMb(element.storageSpace)}
                  />
                );
              })}
          </div>}
      </div>
    </SubContentWrapper>
  )
}

export default People;