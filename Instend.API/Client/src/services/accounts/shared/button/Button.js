import React from 'react';
import './main.css';

const Button = ({state, onClick, title}) => {
    return (
        <button 
            className="button" 
            disabled={state != 'valid'} 
            onClick={onClick}
            id={state}
        >
            {title}
            <div className='button-loader-wrapper' id={state}>
                <div className="button-loader">
                    {Array(12).fill(0).map((_, index) => (
                        (<div key={index}></div>)
                    ))}
            </div>
        </div>
        </button>
    );
};

export default Button;