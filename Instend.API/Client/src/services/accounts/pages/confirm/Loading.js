import React from 'react';
import './styles/loader.css';

const Loading = () => {

    return (

        <div className='spinning-loader-wrapper'>
            <div className="spinning-loader">
                {Array(12).fill(0).map((_, index) => (
                    (<div key={index}></div>)
                ))}
            </div>
        </div>
    
    );

}

export default Loading;