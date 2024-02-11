import React from 'react';
import { useNavigate } from 'react-router-dom';

const Back = () => {

    const navigation = useNavigate();
    const comeBack = () => navigation(-1);

    return (

        <span className='back' onClick={comeBack}>Back</span>

    );

}

export default Back;