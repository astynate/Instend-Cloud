import React, { useState, useRef } from 'react';
import styles from './styles/main.module.css';
import search from './images/search.png';
import notifications from './images/notifications.png';
import add from './images/add.png';
import ProfileModal from '../../features/modal/profile/ProfileModal';

const Header = () => {
    
    const [profilePopUpState, setProfilePopUpState] = useState(false);
    const profileRef = useRef();

    return (

        <>
            <ProfileModal caller={profileRef} state={profilePopUpState} setState={setProfilePopUpState} />
            <div className={styles.search}>
                <img src={search} draggable={false} />
                <input placeholder='Search' />
            </div>
            <div className={styles.header}>
                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <img src={add} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div className={styles.button}>
                        <img src={notifications} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div ref={profileRef} className={styles.button} onClick={() => setProfilePopUpState(prev => !prev)}>
                        <img src='https://e0.pxfuel.com/wallpapers/413/586/desktop-wallpaper-mathilda.jpg' draggable='false' className={styles.avatar} />
                    </div>
                </div>
            </div>
        </>
        
    );

};

export default Header;