import React from 'react';
import './main.css';

const CustomSelect = (props) => {

    console.log(props.options.map((value, index) => {
        
    }));

    return (

        <div className='select'>
            {props.options.map((value, index) => {
                (<div>{value.label}</div>)
            })}
        </div>

    );

}

export default CustomSelect;