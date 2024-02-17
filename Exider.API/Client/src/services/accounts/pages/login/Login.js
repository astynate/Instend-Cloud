import { Link } from 'react-router-dom';
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

    return ValidationHandler.ValidateEmail(email) &&
        password.length >= 8;

};

const Login = () => {

    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidData, setValidationState] = useState(false);

    useEffect(() => {

        setValidationState(ValidateLoginForm(email, password));

    }, [email, password]);

    const Authorize = async () => {

        const userData = new FormData();

        userData.append('email', email);
        userData.append('password', password);
    
        const response = await fetch('/authentication', {
          method: 'POST',
          body: userData,
        });
    
        const result = await response.json();

    };

    return (

        <>
            <h1>{t('account.login_with')} <span className="selected-text">Exider ID</span></h1>
            <p>{t('account.login_with.message')}</p>
            <InputText placeholder={t('account.email_or_nickname')} SetValue={setEmail} autofocus={true} />
            <InputPassword placeholder={t('account.password')} SetValue={setPassword} autofocus={false} />
            <Button title={t('account.login')} active={false} onClick={() => {Authorize()}} disabled={!isValidData} />
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