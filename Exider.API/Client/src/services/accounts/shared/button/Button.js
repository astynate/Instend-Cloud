import React from 'react';
import './main.css'

const Button = (props) => {

    return (

        <button className="button" disabled={props.disabled}>{props.title}</button>

    );

}

export default Button;