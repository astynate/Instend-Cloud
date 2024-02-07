import { Link, useLocation  } from 'react-router-dom';
import React from 'react'
import './css/buttons.css';
import './css/main.css';
import './css/media-queries.css';
import './css/progress-bar.css';
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
import friends_passive from './images/buttons/friends_passive.svg';
import friends_active from './images/buttons/friends_active.svg';
import messages_passive from './images/buttons/messages_passive.svg';
import messages_active from './images/buttons/messages_active.svg';
import profile_passive from './images/buttons/profile_passive.svg';
import profile_active from './images/buttons/profile_active.svg';

const useIsActiveButton = (name) => 
    useIsCurrentRoute(name) ? 'active' : 'passive'

const useIsCurrentRoute = (name) => 
    useLocation()['pathname'] === '/' + name;

const LeftPanel = () => {

    return (
        <div className="left-panel">
            <div className="logo">
                <img src={logo} alt="logo" draggable="false" />
            </div>
            <div className="buttons">
                <Link to="/" className="button" id={useIsActiveButton('')}>
                    <img src={useIsCurrentRoute('') ? home_active : home_passive} draggable="false" />
                    <nav>Home</nav>
                </Link>
                <Link to="/explore" className="button" id={useIsActiveButton('explore')}>
                    <img src={useIsCurrentRoute('explore') ? explore_active : explore_passive} draggable="false" />
                    <nav>Explore</nav>
                </Link>
                <Link to="/cloud" className="button" id={useIsActiveButton('cloud')}>
                    <img src={useIsCurrentRoute('cloud') ? cloud_active : cloud_passive} draggable="false" />
                    <nav>Cloud</nav>
                </Link>
                <Link to="/gallery" className="button" id={useIsActiveButton('gallery')}>
                    <img src={useIsCurrentRoute('gallery') ? gallery_active : gallery_passive} draggable="false" />
                    <nav>Gallery</nav>
                </Link>
                <Link to="/music" className="button" id={useIsActiveButton('music')}>
                    <img src={useIsCurrentRoute('music') ? music_active : music_passive} draggable="false" />
                    <nav>Music</nav>
                </Link>
                <Link to="/friends" className="button" id={useIsActiveButton('friends')}>
                    <img src={useIsCurrentRoute('friends') ? friends_active : friends_passive} draggable="false" />
                    <nav>Friends</nav>
                </Link>
                <Link to="/messages" className="button" id={useIsActiveButton('messages')}>
                    <img src={useIsCurrentRoute('messages') ? messages_active : messages_passive} draggable="false" />
                    <nav>Messages</nav>
                </Link>
                <Link to="/profile" className="button" id={useIsActiveButton('profile')}>
                    <img src={useIsCurrentRoute('profile') ? profile_active : profile_passive} draggable="false" />
                    <nav>Profile</nav>
                </Link>
            </div>
            <div className="progress-bar-wrapper">
                <div className="progress-bar">
                    <div className="line"></div>
                </div>
            </div>
        </div>
    )

}

export default LeftPanel;
