import React from 'react';
import './main.css';

const Line = (props) => {

    return (

        <div className='divide-line'>
            <hr />
            <span className="line-text">{props.title}</span>
        </div>
    
    );

}

export default Line;