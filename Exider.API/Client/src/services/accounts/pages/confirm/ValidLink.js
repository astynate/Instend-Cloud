import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Code from "../../features/confirmation-code/Code";
import Content from "../../widgets/content/Content";
import Line from "../../shared/line/Line";
import Loading from './Loading';

const ValidLink = (props) => {

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            <h1>Email <span className="selected-text">Confirmation</span></h1>
            <p>We have sent you a confirmation code to {props.email} Please enter the confirmation code</p>
            <Code setCode={setCode} />
            <Line />
            <div className='external-links'>
                <div className='external-link'>
                    <p>Didn't receive a confirmation?</p>
                </div>
                <div className='external-link'>
                    <Link>Resend confirmation code</Link>
                </div>
            </div>
        </>

    );

}

export default ValidLink;