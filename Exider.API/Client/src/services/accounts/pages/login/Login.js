import { Link, useNavigate } from 'react-router-dom';
import GoogleOAuth from '../../features/google-oauth/GoogleOAuth';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import InputPassword from "../../shared/password/InputPassword";
import Line from '../../shared/line/Line';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ValidationHandler from '../../../../utils/handlers/ValidationHandler';
import './main.css';

const ValidateLoginForm = (email, password) => {

    return ValidationHandler.ValidateVarchar(email, 45) &&
        password.length >= 8;

};

const Login = () => {

    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState('invalid');
    const navigate = useNavigate();

    useEffect(() => {

        setFormState(ValidateLoginForm(email, password) === true ? 'valid' : 'invalid');

    }, [email, password]);

    const Authorize = async () => {

        const userData = new FormData();

        userData.append('username', email);
        userData.append('password', password);

        setFormState('loading');
        
        const response = await fetch('/authentication', {
            method: 'POST',
            body: userData
        });
        
        if (response.status === 200) {

            const accessToken = await response.text();
            localStorage.setItem('system_access_token', accessToken);

            setFormState('valid');
            navigate('/');

        } else if (response.status === 470) {

            const confirmationLink = await response.text();
            navigate('/account/email/confirmation/' + confirmationLink);

        } else {

            setFormState('invalid');

        }

    }

    return (

        <>
            <h1>{t('account.login_with')} <span className="selected-text">Exider ID</span></h1>
            <p className='page-description'>{t('account.login_with.message')}</p>
            <InputText placeholder={t('account.email_or_nickname')} SetValue={setEmail} autofocus={true} />
            <InputPassword placeholder={t('account.password')} SetValue={setPassword} autofocus={false} />
            <Button title={t('account.login')} state={formState} onClick={() => {Authorize()}} />
            <Line title={t('account.or')} />
            <GoogleOAuth />
            <div className='external-links margin-top-20'>
                <div className='external-link'>
                    <p>{t('account.dont_have_account')}</p>
                    <Link to="/account/create/email">{t('account.registration')}</Link>
                </div>
                <Link to="/">{t('account.forgot_password')}</Link>
            </div>
        </>

    );

}

export default Login;