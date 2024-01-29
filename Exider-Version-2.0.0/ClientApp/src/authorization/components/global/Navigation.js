import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Navigation = () => {

    const location = useLocation();

    useEffect(() => {

        const buttons = document.querySelectorAll('.navigation-button');
        const currentButton = document.querySelector(`[data-location="${location.pathname}"]`);
        const indicator = document.querySelector('#indicator');

        buttons.forEach(button => {
            button.id = 'passive';
        });

        currentButton.id = 'active';
        indicator.style.left = `${currentButton.offsetLeft}px`;
            
    }, [location]);

    return (

        <div className="center">
            <div id="indicator"></div>
            <Link to="login" className="navigation-button" data-location="/login">
                <nav className="navigation">Sign in</nav>
            </Link>
            <Link to="registration" className="navigation-button" data-location="/registration">
                <nav className="navigation">Create Exider ID</nav>
            </Link>
        </div>

    );

};

export default Navigation;