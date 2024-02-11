import React from 'react';
import './main.css';

const Line = (props) => {

    return (

        <div className='line'>
            <hr />
            <span className="line-text">{props.title}</span>
        </div>
    
    );

}

export default Line;