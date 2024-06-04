import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/main.module.css';
import notifications from './images/notifications.png';
import add from './images/add.png';
import notificationsActive from './images/notifications-active.png';
import addActive from './images/add-active.png';
import { observer } from 'mobx-react-lite';
import userState from '../../../../states/user-state';
import ProfileModal from '../../features/modal/profile/ProfileModal';
import PopUpList from '../../shared/ui-kit/pop-up-list/PopUpList';
import CommunityEditor from '../../features/add-community-pop-up/CommunityEditor';

const Header = observer((props) => {
    const [profilePopUpState, setProfilePopUpState] = useState(false);
    const [current, setCurrect] = useState(-1);
    const [openCreateCommunity, setCreateCommunityState] = useState(false);
    const { user } = userState;
    const wrapper = useRef();
    const profileRef = useRef();

    useEffect(() => {
        const handleClick = (event) => {
          if (wrapper.current && wrapper.current.contains(event.target)) {
            return;
          }
          setCurrect(-1);
        };
      
        window.addEventListener('click', handleClick);
      
        return () => {
          window.removeEventListener('click', handleClick);
        };
    }, []);
      
    const handleWrapperClick = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            <ProfileModal 
                caller={profileRef} 
                state={profilePopUpState} 
                setState={setProfilePopUpState} 
            />
            <div className={styles.header} ref={wrapper}>
                {props.children}
                <CommunityEditor 
                    open={openCreateCommunity}
                    close={() => setCreateCommunityState(false)}
                />
                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <img 
                            src={current === 0 ? addActive : add} 
                            className={styles.buttonImage} 
                            draggable='false' 
                            onClick={() => setCurrect(0)}
                        />
                        <div className={styles.list}>
                            {current === 0 && <PopUpList 
                                items={[
                                    {title: 'Community', callback: () => {setCreateCommunityState(true)}}
                                ]}
                                close={() => setCurrect(-1)}
                            />}
                        </div>
                    </div>
                    <div className={styles.button}>
                        <img 
                            src={current === 1 ? notificationsActive : notifications} 
                            className={styles.buttonImage} 
                            draggable='false' 
                            onClick={() => setCurrect(1)}
                        />
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