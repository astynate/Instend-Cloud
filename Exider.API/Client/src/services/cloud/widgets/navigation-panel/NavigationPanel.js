import { Link, useLocation  } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react'
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
import { useTranslation } from 'react-i18next';
import userState from '../../../../states/user-state';
import { observer } from 'mobx-react-lite';
import arrow from './images/player/arrow.png';
import SongQueue from './components/song-queue/SongQueue';
import SimpleRange from '../../shared/ui-kit/simple-range/SimpleRange';
import musicState from '../../../../states/music-state';
import storageState from '../../../../states/storage-state';
import SongCover from '../../shared/ui-kit/song/song-cover/SongCover';
import { convertFromTimespan, convertTicksToTime } from '../../../../utils/TimeHandler';
import { layoutContext } from '../../layout/Layout';

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
    if (!song) {
        return 'Не исполняется';
    }

    if (song.title) {
        return song.title;
    } else {
        return song.name;
    }
}

export const GetSongData = (song) => {
    if (!song) {
        return 'Артист — Альбом';
    }

    if (song.artist) {
        return song.artist;
    } else {
        return 'Артист — Альбом';
    }
}

const NavigationPanel = observer((props) => {
    const { user } = userState;
    const { t } = useTranslation();
    const { song } = useContext(layoutContext);
    const [isQueueOpen, setQueueOpenState] = useState(false);
    const [isHovered, setHoveredState] = useState(false);

    const occupiedPercentage = () => {
        if (user && user.occupiedSpace && user.storageSpace) {
            return (user.occupiedSpace / user.storageSpace) * 100;
        } else {
            return 0;
        }
    }

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
                <div 
                    className={styles.musicPlayer} 
                    onMouseEnter={() => setHoveredState(true)}
                    onMouseLeave={() => setHoveredState(false)}
                >
                    <div className={styles.albumCover} onClick={() => musicState.ChangePlayingState()}>
                        <SongCover 
                            song={song}
                            isLoading={false}
                            isPlaying={musicState.isPlaying}
                            isHovered={isHovered}
                        />
                    </div>
                    <div className={styles.information} onClick={() => setQueueOpenState(prev => !prev)}>
                        <div className={styles.info}>
                            <span className={styles.songName}>{GetSongName(song)}</span>
                            <span className={styles.artist}>{GetSongData(song)}</span>
                        </div>
                        <img 
                            src={arrow} 
                            className={styles.arrow} 
                            id={isQueueOpen ? "open" : null} 
                        />
                    </div>
                </div>
                <div className="progress-bar">
                    <SimpleRange 
                        step={1}
                        minValue={0}
                        maxValue={song && song.durationTicks ? song.durationTicks : 1}
                        value={musicState.time}
                        setValue={musicState.setTime.bind(musicState)}
                        loadPercentage={musicState.loadPercentage}
                    />
                </div>
                <div className={styles.time}>
                    <span>{song ? convertTicksToTime(musicState.time) : '--:--'}</span>
                    <span>{song && song.duration ? convertFromTimespan(song.duration) : '--:--'}</span>
                </div>
            </div>
            <SongQueue openState={isQueueOpen} />
        </div>
    )
})

export default NavigationPanel;