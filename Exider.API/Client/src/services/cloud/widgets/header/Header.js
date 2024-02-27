import React, { useState, useRef } from 'react';
import styles from './styles/main.module.css';
import notifications from './images/notifications.png';
import add from './images/add.png';
import { observer } from 'mobx-react-lite';
import userState from '../../../../states/user-state';
import ProfileModal from '../../features/modal/profile/ProfileModal';

const Header = observer((props) => {
    
    const [profilePopUpState, setProfilePopUpState] = useState(false);
    const { user } = userState;
    const profileRef = useRef();

    return (

        <>
            <ProfileModal caller={profileRef} state={profilePopUpState} setState={setProfilePopUpState} />
            {props.children}
            <div className={styles.header}>
                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <img src={add} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div className={styles.button}>
                        <img src={notifications} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div ref={profileRef} className={styles.button} onClick={() => setProfilePopUpState(prev => !prev)}>
                        <img src={`data:image/png;base64,${user.avatar}`} draggable='false' className={styles.avatar} />
                    </div>
                </div>
            </div>
        </>
        
    );

});

export default Header;