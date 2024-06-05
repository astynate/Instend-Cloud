import React from 'react';
import styles from './styles/main.module.css';
import { observer } from 'mobx-react-lite';
import Avatar from '../../features/profile/avatar/Avatar';
import Data from '../../features/profile/data/Data';
import Username from '../../features/profile/username/Username';

const Description = observer(({isMobile, avatar, title, subtitle, buttons, stats}) => {
  return (
    <div className={styles.description}>
      <Avatar src={`data:image/png;base64,${avatar ? avatar : null}`} />
      <div className={styles.profileDescription}>
        <Username username={title} />
        <Data 
          stats={stats}
        />
        <div>
          <h3 className={styles.name}>{subtitle}</h3>
        </div>
      </div>
      <div className={styles.editProfile}>
        <div className={styles.navButton}>
          {buttons.map((element, index) => {
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
  )
});

export default Description;