import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Code from "../../features/confirmation-code/Code";
import Content from "../../widgets/content/Content";
import Line from "../../shared/line/Line";
import Loading from './Loading';

const ValidLink = (props) => {

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (code.length === 6) {

            setLoading(true);

        }

    }, [code]);

    return (

        loading ? (<Loading />) :
        
            (<Content title="Confirm Email Address">
                <h1>Email <span className="selected-text">Confirmation</span></h1>
                <p>We have sent you a confirmation code to {props.email}<br /> Please enter the code in the field below</p>
                <Code setCode={setCode} />
                <div className='external-links'>
                    <div className='external-link'>
                        <p>Didn't receive a confirmation?</p>
                    </div>
                    <div className='external-link'>
                        <Link>Resend confirmation code</Link>
                    </div>
                </div>
                <Line />
            </Content>)

    );

}

export default ValidLink;