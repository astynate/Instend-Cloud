import React from "react";
import styles from './styles/main.module.css';
import userState from "../../../../../states/user-state";
import settings from './images/settings.png';
import logout from './images/logout.png';
import { Link, useNavigate } from 'react-router-dom';

const ProfileModal = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.miniProfile}>
            <img
                src={`data:image/png;base64,${userState.user.avatar}`} 
                className={styles.avatar}
                draggable="false"
            />
            <span className={styles.nickname}>{userState.user.nickname}</span>
            <span className={styles.name}>{userState.user.name} {userState.user.surname}</span>
            <Link to={'/settings/profile'} className={styles.button}>
                <img src={settings} className={styles.buttonImage} />
                <span>Settings</span>
            </Link>
            <div 
                className={styles.button}
                onClick={() => {
                    localStorage.clear('system_access_token');
                    document.cookie = "system_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    navigate('/main');
                    userState.Logout();
                }}
            >
                <img src={logout} className={styles.buttonImage} />
                <span>Logout</span>
            </div>
        </div>
    );
};

export default ProfileModal;