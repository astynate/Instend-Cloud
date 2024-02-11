import React from 'react';
import './main.css'

const Button = (props) => {

    return (

        <button class="button" disabled={props.active}>{props.title}</button>

    );

}

export default Button;