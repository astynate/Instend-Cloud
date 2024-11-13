import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './styles/main.module.css';
import notifications from './images/notifications.png';
import notificationsActive from './images/notifications-active.png';
import userState from '../../../../state/entities/UserState';
import music from './images/music.png';
import musicActive from './images/music-active.png';
import HeaderMusicPlayer from '../../singletons/header-music-player/HeaderMusicPlayer';
import Notifications from '../../singletons/notifications-popup/Notifications';
import ProfilePopUp from '../../singletons/profile-popup/ProfilePopUp.jsx';

const Header = observer((props) => {
    const [current, setCurrect] = useState(-1);
    const { user } = userState;
    const wrapper = useRef();
    const profileRef = useRef();

    useEffect(() => {
        userState.SetCountNotifications();
    }, [userState, userState.friends, userState.friends.length]);

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
        <div className={styles.header} ref={wrapper}>
            {props.children}
            <div className={styles.buttons}>
                <div className={styles.button}>
                    <img 
                        src={current === 0 ? musicActive : music} 
                        className={styles.buttonImage} 
                        draggable='false' 
                        onClick={() => setCurrect(0)}
                    />
                    {current === 0 && <HeaderMusicPlayer />}
                </div>
                <div className={styles.button}>
                    {userState.countNotifications > 0 && <div className={styles.hasNotifications}></div>}
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
                        src={`data:image/png;base64,${user.avatar}`} 
                        draggable='false' 
                        className={styles.avatar} 
                    />
                    {current === 2 && <ProfilePopUp forwardRef={profileRef} />}
                </div>
            </div>
        </div>
    );
});

export default Header;