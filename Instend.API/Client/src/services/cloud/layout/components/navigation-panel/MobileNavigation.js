import React from 'react';
import { Link, useLocation  } from 'react-router-dom';
import './css/navigation.buttons.css';
import './css/main.css';
import './css/progress-bar.css';
import './css/media-queries.css';
import home_passive from './images/buttons/home_passive.svg';
import home_active from './images/buttons/home_active.svg';
import explore_passive from './images/buttons/explore_passive.svg';
import explore_active from './images/buttons/explore_active.svg';
import messages_passive from './images/buttons/messages_passive.svg';
import messages_active from './images/buttons/messages_active.svg';
import gallery_passive from './images/buttons/gallery_passive.svg';
import gallery_active from './images/buttons/gallery_active.svg';
import music_passive from './images/buttons/music_passive.svg';
import music_active from './images/buttons/music_active.svg';

const useIsActiveButton = (name) => 
    useIsCurrentRoute(name) ? 'active' : 'passive'

const useIsCurrentRoute = (name) => 
    useLocation()['pathname'] === '/' + name;

const MobileNavigation = () => {
    return (
        <div className='mobile-navigation-panel'>
            <Link to="/" className="navigation-button" id={useIsActiveButton('')}>
                <img src={useIsCurrentRoute('') ? home_active : home_passive} draggable="false" alt="H" />
            </Link>
            <Link to="/cloud" className="navigation-button" id={useIsActiveButton('cloud')}>
                <img src={useIsCurrentRoute('explore') ? explore_active : explore_passive} draggable="false" alt="E" />
            </Link>
            <Link to="/gallery" className="navigation-button" id={useIsActiveButton('gallery')}>
                <img src={useIsCurrentRoute('gallery') ? gallery_active : gallery_passive} draggable="false" alt="G" />
            </Link>
            <Link to="/messages" className="navigation-button" id={useIsActiveButton('messages')}>
                <img src={useIsCurrentRoute('messages') ? messages_active : messages_passive} draggable="false" alt="M" />
            </Link>
            <Link to="/music" className="navigation-button" id={useIsActiveButton('gallery')}>
                <img src={useIsCurrentRoute('music') ? music_active : music_passive} draggable="false" alt="G" />
            </Link>
        </div>
    );
};

export default MobileNavigation;