import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Code from "../../features/confirmation-code/Code";
import Line from "../../shared/line/Line";
import Loading from './Loading';
import Button from '../../shared/button/Button';
import Error from '../../shared/error/Error';

const ValidLink = (props) => {

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendingState, setResendingState] = useState('valid');
    const [isError, setErrorState] = useState(false);
    const navigate = useNavigate();

    const ResendConfirmation = async () => {

        const controller = new AbortController();
        const { signal } = controller;

        const timeoutId = setTimeout(() => {

            controller.abort();

        }, 5000);

        setResendingState('loading');

        const response = await fetch(`/confirmations?link=${props.link}`, 
            {method: 'PUT', signal});

        setResendingState('invalid');

        setTimeout(() => {

            setResendingState('valid');

        }, 60000);

        clearTimeout(timeoutId);

    }

    useEffect(() => {

        const ConfirmEmail = async () => {

            const controller = new AbortController();
            const { signal } = controller;

            const timeoutId = setTimeout(() => {

                controller.abort();

            }, 5000);

            const response = await fetch(`/confirmations?link=${props.link}&code=${code}`, 
                {method: 'POST', signal});
            
            if (response.status === 200) {

                navigate('/account/login');

            } else {

                setErrorState(true);

            }

            setLoading(false);
            clearTimeout(timeoutId);

        };

        if (code.length === 6) {

            setLoading(true);
            ConfirmEmail();

        }

    }, [code]);

    return (

        loading ? (<Loading />) :

        <>
            { isError ? <Error message="Something went wrong." state={isError} setState={setErrorState} /> : null }
            <h1>Email <span className="selected-text">Confirmation</span></h1>
            <p className='page-description'>We have sent you a confirmation code to {props.email} Please enter the confirmation code</p>
            <Code setCode={setCode} />
            <Line />
            <div className='margin-top-40'>
                <Button 
                    state={resendingState} 
                    title='Send again'
                    onClick={() => ResendConfirmation()}
                />
            </div>
        </>

    );

}

export default ValidLink;