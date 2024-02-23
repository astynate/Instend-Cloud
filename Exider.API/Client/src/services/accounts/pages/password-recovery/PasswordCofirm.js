import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Code from "../../features/confirmation-code/Code";
import Line from "../../shared/line/Line";
import Loading from '../confirm/Loading';
import Error from '../../shared/error/Error';
import { PasswordRecoveryContext } from '../../processes/PasswordRecovery';
import { Link } from 'react-router-dom';

const PasswordCofirm = (props) => {

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isError, setErrorState] = useState(false);
    const navigate = useNavigate();
    let data = useContext(PasswordRecoveryContext);

    useEffect(() => {

        const ConfirmEmail = async () => {

            const controller = new AbortController();
            const { signal } = controller;

            const timeoutId = setTimeout(() => {

                controller.abort();

            }, 5000);

            const response = await fetch(`/password-recovery?link=${props.link}&code=${code}`, 
                {method: 'GET', signal});
            
            if (response.status === 200) {

                data.code = code;
                data.link = props.link;
                data.isCodeValid = true;

                navigate('/account/password/recovery/new-password');

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
            <h1>Password <span className="selected-text">Recovery</span></h1>
            <p className='page-description'>We have sent you a confirmation code to {props.email} Please enter the confirmation code</p>
            <Code setCode={setCode} />
            <Line />
            <div className='external-links'>
                <div className='external-link'>
                    <p>Don't need to recover your password?</p>
                </div>
                <div className='external-link'>
                    <Link to='/account/login'>Go back to main page</Link>
                </div>
            </div>
        </>

    );

}

export default PasswordCofirm;