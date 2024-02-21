import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputCheck from "../../shared/input-check/InputCheck";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";

const Email = () => {

    const user = useContext(UserContext);
    const [email, setEmail] = useState(user.email);
    const [isValidEmail, setEmailState] = useState(ValidationHandler.ValidateEmail(user.email));

    useEffect(() => {

        user.email = email;

    }, [user, email]);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p className='page-description'>Please enter your email. This field is required and must look like example@domain.com</p>
            <InputCheck
                placeholder='Email'
                autofocus={true}
                defaultValue={user.email}
                SetValue={setEmail}
                validationFunction={ValidationHandler.ValidateEmail}
                setFieldState={setEmailState}
                endpoint='/accounts/email'
            />
            <Link to='/account/create/nickname' className='next margin-top-40'>
                <Button title="Next" state={isValidEmail ? 'valid' : 'invalid'} />
            </Link>
        </>

    );

}

export default Email;