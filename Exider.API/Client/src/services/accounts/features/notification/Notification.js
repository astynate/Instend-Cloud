import React from 'react';
import './styles/main.css';

const Notification = (props) => {

    return (

        <div className='notification'>
            <div className='notification-title'>
                {props.children}
                <p>{props.title}</p>
            </div>
        </div>
    
    );

}

export default Notification;