import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './styles/main.module.css';
import Avatar from '../../features/profile/avatar/Avatar';
import Data from '../../features/profile/data/Data';
import Username from '../../features/profile/username/Username';
import SubContentWrapper from '../../features/sub-content-wrapper/SubContentWrapper';

const ProfileDescriptionAbstractTemplate = observer(({isMobile, isLoading, avatar, title, subtitle, buttons, stats}) => {
  return (
    <SubContentWrapper>
      <div className={styles.description}>
        <Avatar 
          isLoading={isLoading}
          src={avatar ? avatar : null}
        />
        <div className={styles.profileDescription}>
          <Username 
            username={title} 
            isLoading={isLoading}
          />
          <Data 
            stats={stats}
            isLoading={isLoading}
          />
          <div className={styles.navButton}>
            {buttons.map((element, index) => {
                if (isLoading === true) {
                  return (<div className={styles.button} key={index}></div>)
                }

                return (
                  <div 
                    className={styles.button} 
                    key={index}
                    onClick={() => element.callback()}
                  >
                    <span>{element.title}</span>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </SubContentWrapper>
  )
});

export default ProfileDescriptionAbstractTemplate;