import React from 'react';
import './main.css'

const Button = (props) => {

    return (
        <button 
            className="button" 
            disabled={props.state != 'valid'} 
            onClick={props.onClick}
            id={props.state}
        >
            {props.title}
            <div className='button-loader-wrapper' id={props.state}>
                <div className="button-loader">
                    {Array(12).fill(0).map((_, index) => (
                        (<div key={index}></div>)
                    ))}
            </div>
        </div>
        </button>
    );

}

export default Button;