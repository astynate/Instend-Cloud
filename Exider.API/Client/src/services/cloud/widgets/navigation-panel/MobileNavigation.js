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
import cloud_passive from './images/buttons/cloud_passive.svg';
import cloud_active from './images/buttons/cloud_active.svg';
import messages_passive from './images/buttons/messages_passive.svg';
import messages_active from './images/buttons/messages_active.svg';
import profile_passive from './images/buttons/profile_passive.svg';
import profile_active from './images/buttons/profile_active.svg';

const useIsActiveButton = (name) => 
    useIsCurrentRoute(name) ? 'active' : 'passive'

const useIsCurrentRoute = (name) => 
    useLocation()['pathname'] === '/' + name;

const MobileNavigation = () => {

    return (

        <div className='mobile-navigation-panel'>
            <Link to="/" className="navigation-button" id={useIsActiveButton('')}>
                <img src={useIsCurrentRoute('') ? home_active : home_passive} draggable="false" alt="H" />
                <nav>Home</nav>
            </Link>
            <Link to="/explore" className="navigation-button" id={useIsActiveButton('explore')}>
                <img src={useIsCurrentRoute('explore') ? explore_active : explore_passive} draggable="false" alt="E" />
                <nav>Explore</nav>
            </Link>
            <Link to="/cloud" className="navigation-button" id={useIsActiveButton('cloud')}>
                <img src={useIsCurrentRoute('cloud') ? cloud_active : cloud_passive} draggable="false" alt="C" />
                <nav>Cloud</nav>
            </Link>
            <Link to="/messages" className="navigation-button" id={useIsActiveButton('messages')}>
                <img src={useIsCurrentRoute('messages') ? messages_active : messages_passive} draggable="false" alt="M" />
                <nav>Messages</nav>
            </Link>
            <Link to="/profile" className="navigation-button" id={useIsActiveButton('profile')}>
                <img src={useIsCurrentRoute('profile') ? profile_active : profile_passive} draggable="false" alt="P" />
                <nav>Profile</nav>
            </Link>
        </div>
        
    );

};

export default MobileNavigation;