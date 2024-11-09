import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { ConvertBytesToMb } from '../../../../utils/handlers/StorageSpaceHandler';
import './css/navigation.buttons.css';
import './css/main.css';
import './css/progress-bar.css';
import './css/media-queries.css';
import styles from './css/main.module.css';
import logo from './images/logo/main-logo-black.svg';
import home_passive from './images/buttons/home_passive.svg';
import home_active from './images/buttons/home_active.svg';
import explore_passive from './images/buttons/explore_passive.svg';
import explore_active from './images/buttons/explore_active.svg';
import cloud_passive from './images/buttons/cloud_passive.svg';
import cloud_active from './images/buttons/cloud_active.svg';
import gallery_passive from './images/buttons/gallery_passive.svg';
import gallery_active from './images/buttons/gallery_active.svg';
import music_passive from './images/buttons/music_passive.svg';
import music_active from './images/buttons/music_active.svg';
import messages_passive from './images/buttons/messages_passive.svg';
import messages_active from './images/buttons/messages_active.svg';
import profile_passive from './images/buttons/profile_passive.svg';
import profile_active from './images/buttons/profile_active.svg';
import userState from '../../../../states/user-state';
import musicState from '../../../../states/music-state';
import storageState from '../../../../states/storage-state';
import createImage from './images/buttons/create.png';

export const useIsActiveButton = (name) => 
    useIsCurrentRoute(name) ? 'active' : 'passive'

export const useIsCurrentRoute = (name) => 
    useLocation()['pathname'] === '/' + name;

export const GetCurrentSong = () => {
    if (musicState.songQueue && musicState.songQueue.length > 0 && musicState.songQueue[musicState.currentSongIndex]) {
        return storageState.FindFileById(musicState.songQueue[musicState.currentSongIndex].id);
    }

    return null;
}

export const GetSongName = (song) => {
    if (!!song === false)
        return 'Не исполняется';

    return song.title ? song.title : song.name;
}

export const GetSongData = (song) => {
    if (!!song === false)
        return 'Артист — Альбом';

    return song.artist ? song.artist : 'Артист — Альбом';
}

const NavigationPanel = observer((props) => {
    const [isOpened, setOpenedState] = useState(false);
    const [occupiedSpace, setOccupiedSpace] = useState();

    const { user } = userState;
    const { t } = useTranslation();

    const ref = useRef();

    const occupiedPercentage = () => {
        if (user && user.occupiedSpace && user.storageSpace) {
            return Math.floor((user.occupiedSpace / user.storageSpace) * 100);
        } 
        
        return 0;
    }

    useEffect(() => {
        const clickHandler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenedState(false);
            }
        }

        document.addEventListener('click', clickHandler);

        return () => {
            document.removeEventListener('click', clickHandler);
        }
    }, []);

    useEffect(() => {
        if (!!user === true) {
            setOccupiedSpace(occupiedPercentage());
        }
    }, [user]);

    return (
        <div className="left-panel" id={props.isPanelRolledUp ? 'rolled-up' : null}>
            <div className="left-panel-logo">
                <img src={logo} alt="logo" draggable="false" />
            </div>
            <div className="navigation-buttons">
                <Link to="/" className="navigation-button" id={useIsActiveButton('')}>
                    <img src={useIsCurrentRoute('') ? home_active : home_passive} draggable="false" alt="H" />
                    <nav>{t('cloud.navigation.home')}</nav>
                </Link>
                <Link to="/explore" className="navigation-button" id={useIsActiveButton('explore')}>
                    <img src={useIsCurrentRoute('explore') ? explore_active : explore_passive} draggable="false" alt="E" />
                    <nav>{t('cloud.navigation.explore')}</nav>
                </Link>
                <Link to="/cloud" className="navigation-button" id={useIsActiveButton('cloud')}>
                    <img src={useIsCurrentRoute('cloud') ? cloud_active : cloud_passive} draggable="false" alt="C" />
                    <nav>{t('cloud.navigation.cloud')}</nav>
                </Link>
                <Link to="/gallery" className="navigation-button" id={useIsActiveButton('gallery')}>
                    <img src={useIsCurrentRoute('gallery') ? gallery_active : gallery_passive} draggable="false" alt="G" />
                    <nav>{t('cloud.navigation.gallery')}</nav>
                </Link>
                <Link to="/music" className="navigation-button" id={useIsActiveButton('music')}>
                    <img src={useIsCurrentRoute('music') ? music_active : music_passive} draggable="false" alt="M" />
                    <nav>{t('cloud.navigation.music')}</nav>
                </Link>
                <Link to="/messages" className="navigation-button" id={useIsActiveButton('messages')}>
                    <img src={useIsCurrentRoute('messages') ? messages_active : messages_passive} draggable="false" alt="M" />
                    <nav>{t('cloud.navigation.messages')}</nav>
                </Link>
                <Link to="/profile" className="navigation-button" id={useIsActiveButton('profile')}>
                    <img src={useIsCurrentRoute('profile') ? profile_active : profile_passive} draggable="false" alt="P" />
                    <nav>{t('cloud.navigation.profile')}</nav>
                </Link>
            </div>
            <div className="progress-bar-wrapper">
                <div className={styles.createWrapper}>
                    <button 
                        state={isOpened ? 'opened' : null}
                        className={styles.create} 
                        onClick={() => setOpenedState(prev => !prev)}
                        ref={ref}
                    >
                        <img src={createImage} />
                        <span>Create</span>
                    </button>
                    <div className={styles.panel} state={isOpened ? 'opened' : null}>

                    </div>
                </div>
                <div className='progress-bar'>
                    <div className='line' style={{'--space-occupied': `${occupiedSpace}%`}}></div>
                </div>
                <div className='occupied-space'>
                    <span>{ConvertBytesToMb(user.occupiedSpace)} MB</span>
                    <span>{ConvertBytesToMb(user.storageSpace)} MB</span>
                </div>
            </div>
        </div>
    )
})

export default NavigationPanel;