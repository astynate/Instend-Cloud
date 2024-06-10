import React from 'react';
import styles from './styles/main.module.css';
import { observer } from 'mobx-react-lite';
import Avatar from '../../features/profile/avatar/Avatar';
import Data from '../../features/profile/data/Data';
import Username from '../../features/profile/username/Username';
import MainContentWrapper from '../../features/main-content-wrapper/MainContentWrapper';

const Description = observer(({isMobile, isLoading, avatar, title, subtitle, buttons, stats}) => {
  return (
    <MainContentWrapper>
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
          <div>
            {isLoading === true ? 
              <div className={styles.placeholder}></div>
            :
              <h3 className={styles.name}>{subtitle}</h3>
            }
          </div>
          {isMobile && buttons.map((element, index) => {
              if (isLoading) {
                return (<div className={styles.button} key={index}></div>)
              } else {
                return (
                  <div 
                    className={styles.button} 
                    key={index}
                    onClick={() => element.callback()}
                  >
                    <span>{element.title}</span>
                  </div>
                );
              }
            })}
        </div>
        <div className={styles.editProfile}>
          <div className={styles.navButton}>
          {!isMobile && buttons.map((element, index) => {
              if (isLoading) {
                return (<div className={styles.button} key={index}></div>)
              } else {
                return (
                  <div 
                    className={styles.button} 
                    key={index}
                    onClick={() => element.callback()}
                  >
                    <span>{element.title}</span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </MainContentWrapper>
  )
});

export default Description;