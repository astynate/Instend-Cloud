import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

const ExternalLink = (props) => {

    return (

        <>
            <Link to={props.link} className="link">
                <img src={props.logo} className="icon" alt={props.name} />
                <span className="name">{props.name}</span>
            </Link>
        </>

    );

}

export default ExternalLink;