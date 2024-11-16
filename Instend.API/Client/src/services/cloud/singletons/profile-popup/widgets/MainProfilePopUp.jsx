import { Link, useNavigate } from 'react-router-dom';
import UserState from '../../../../../state/entities/UserState';
import styles from '../styles/main.module.css';
import settings from '../images/settings.png';
import moon from '../images/moon.png';
import language from '../images/language.png';
import logout from '../images/logout.png';

const MainProfilePopUp = ({setCurrentWindow = () => {}}) => {
    const Logout = () => {
        useNavigate('/main');
        localStorage.clear('system_access_token');
        document.cookie = "system_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        UserState.Logout();
    }

    const SetCurrent = (event, value) => {
        event.preventDefault();
        event.stopPropagation();

        setCurrentWindow(value);
    }

    return (
        <div className={styles.miniProfile}>
            <div className={styles.header}>
                <img
                    src={`data:image/png;base64,${UserState.user.avatar}`} 
                    className={styles.avatar}
                    draggable="false"
                />
                <div className={styles.information}>
                    <span className={styles.nickname}>{UserState.user.nickname}</span>
                    <span className={styles.name}>{UserState.user.name} {UserState.user.surname}</span>
                    <Link to="/profile" className={styles.link}>Show profile</Link>
                </div>
            </div>
            <hr />
            <Link to={'/settings/profile'} className={styles.button}>
                <img src={settings} className={styles.buttonImage} />
                <span>Settings</span>
            </Link>
            <hr />
            <div className={styles.button} onClick={(e) => SetCurrent(e, 1)}>
                <img src={moon} className={styles.buttonImage} />
                <span>Theme</span>
            </div>
            <div className={styles.button} onClick={(e) => SetCurrent(e, 2)}>
                <img src={language} className={styles.buttonImage} />
                <span>Language</span>
            </div>
            <hr />
            <div className={styles.button} onClick={Logout}>
                <img src={logout} className={styles.buttonImage} />
                <span>Logout</span>
            </div>
        </div>
    );
}

export default MainProfilePopUp;