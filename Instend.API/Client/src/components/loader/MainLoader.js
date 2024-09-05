import React from "react";
import './main.css';
import logo from './logo.svg';

const MainLoader = () => {

    return(

        <div className="main-loader" id="active">
            <img src={logo} draggable="false" />
            <div className="main-loader-line"></div>
            <div className="main-loader-background"></div>
        </div>

    );

};

export default MainLoader;