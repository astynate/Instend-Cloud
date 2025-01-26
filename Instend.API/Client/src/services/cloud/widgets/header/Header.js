import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './styles/main.module.css';
import notifications from './images/notifications.png';
import notificationsActive from './images/notifications-active.png';
import AccountState from '../../../../state/entities/AccountState.js';
import music from './images/music.png';
import musicActive from './images/music-active.png';
import SongQueue from '../../singletons/song-queue/SongQueue.jsx';
import Notifications from '../../singletons/notifications-popup/Notifications';
import ProfilePopUp from '../../singletons/profile-popup/ProfilePopUp.jsx';
import StorageController from '../../../../api/StorageController.js';

const Header = observer((props) => {
    const [current, setCurrect] = useState(-1);
    const { account } = AccountState;
    const wrapper = useRef();
    const profileRef = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                setCurrect(-1);
            }
        };
      
        window.addEventListener('click', handleClick);
      
        return () => {
          window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className={styles.header} ref={wrapper} background={props.isBackgroundLess ? null : "visible"}>
            {props.children}
            <div className={styles.buttons}>
                <div className={styles.button}>
                    <img 
                        src={current === 0 ? musicActive : music} 
                        className={styles.buttonImage} 
                        draggable='false' 
                        onClick={() => setCurrect(0)}
                    />
                    {current === 0 && 
                        <div className={styles.songQueueWrapper}>
                            <SongQueue />
                        </div>}
                </div>
                <div className={styles.button}>
                    {AccountState.countNotifications > 0 && <div className={styles.hasNotifications}></div>}
                    <img 
                        src={current === 1 ? notificationsActive : notifications} 
                        className={styles.buttonImage} 
                        draggable='false' 
                        onClick={() => setCurrect(1)}
                    />
                    {current === 1 && <Notifications />}
                </div>
                <div className={styles.button} onClick={() => setCurrect(2)}>
                    <img 
                        src={StorageController.getFullFileURL(account.avatar)} 
                        draggable='false' 
                        className={styles.avatar} 
                    />
                    {current === 2 && 
                        <div className={styles.miniProfile}>
                            <ProfilePopUp forwardRef={profileRef} />
                        </div>}
                </div>
            </div>
        </div>
    );
});

export default Header;