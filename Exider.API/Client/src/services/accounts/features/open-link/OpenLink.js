import React, { useState } from 'react';
import Arraw from './arrow.png';
import './main.css';

const OpenLink = (props) => {

    const [isOpen, setOpenState] = useState(false);

    return (

        <div className='open-link' onClick={() => setOpenState(prev => !prev)}>
            <span>{props.title}</span>
            <img src={Arraw} className={isOpen ? 'open' : 'none'} />
        </div>

    );

}

export default OpenLink;