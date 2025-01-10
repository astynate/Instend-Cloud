import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputCheck from "../../shared/input-check/InputCheck";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";
import { useTranslation } from "react-i18next";

const Email = () => {
    const user = useContext(UserContext);
    const [email, setEmail] = useState(user.email);
    const [isValidEmail, setEmailState] = useState(ValidationHandler.ValidateEmail(user.email));
    const { t } = useTranslation();

    useEffect(() => {
        user.email = email;
    }, [user, email]);

    return (
        <>
            <h1>{t('account.create.creation_of')} <span className="selected-text">Instend ID</span></h1>
            <p className='page-description'>{t('account.create.email_desc')}</p>
            <InputCheck
                placeholder={t('account.email')}
                autofocus={true}
                defaultValue={user.email}
                SetValue={setEmail}
                validationFunction={ValidationHandler.ValidateEmail}
                setFieldState={setEmailState}
                statusCode={470}
                endpoint='/accounts/email'
            />
            <Link to='/account/create/nickname' className='next margin-top-40'>
                <Button title={t('account.next')} state={isValidEmail ? 'valid' : 'invalid'} />
            </Link>
        </>
    );
}

export default Email;