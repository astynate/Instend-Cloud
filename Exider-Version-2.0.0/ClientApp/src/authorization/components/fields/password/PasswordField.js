import React, { useState, useEffect } from 'react';
import '../main.css';
import './main.css';
import hidden from './images/hidden.png';
import show from './images/show.png';

const PasswordField = () => {

    let [passwordVisibility, setPasswordVisibility] = useState(false);

    return (

        <div className="input-wrapper">

            <input
                type={passwordVisibility ? "text" : "password"}
                name="password"
                placeholder="Password"
                maxLength="40" />

            <img
                src={passwordVisibility ? hidden : show}
                className="input-button"
                onClick={() => setPasswordVisibility(previousState => previousState ? false : true)}
                draggable="false" />

        </div>

    );

}

export default PasswordField;