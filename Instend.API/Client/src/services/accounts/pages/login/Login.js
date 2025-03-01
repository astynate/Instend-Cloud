import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import InputPassword from "../../shared/password/InputPassword";
import Line from '../../shared/line/Line';
import Error from '../../shared/error/Error'
import ValidationHandler from '../../../../handlers/ValidationHandler';
import './main.css';

const ValidateLoginForm = (email, password) => {
    return ValidationHandler.ValidateVarchar(email, 45) &&
        password.length >= 8;
};

const Login = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formState, setFormState] = useState('invalid');
    const [isError, setErrorState] = useState(false);

    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setFormState(ValidateLoginForm(email, password) === true ? 'valid' : 'invalid');
    }, [email, password]);

    const Authorize = async () => {
        const userData = new FormData();

        userData.append('username', email);
        userData.append('password', password);
      
        setFormState('loading');
      
        const controller = new AbortController();
        const signal = controller.signal;
      
        const timeoutId = setTimeout(() => {
            controller.abort();
            setFormState('invalid');
        }, 10000);
      
        try {
            const response = await fetch('/authentication', {
                method: 'POST',
                body: userData,
                signal: signal,
            });
      
            clearTimeout(timeoutId);
        
            if (response.status === 200) {
                localStorage.setItem('system_access_token', await response.text());

                navigate('/');
                setFormState('valid');
            } else if (response.status === 470) {
                const confirmationLink = await response.text();
                navigate('/account/email/confirmation/' + confirmationLink);
            } else {
                setErrorState(true);
                setFormState('invalid');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            setFormState('invalid');
            setErrorState(true);
        }
    };

    return (
        <GoogleOAuthProvider clientId="1099397056156-quc1l3h460li634u6o8eh03feat63s7v.apps.googleusercontent.com">
            { isError ? <Error message="Something went wrong." state={isError} setState={setErrorState} /> : null }
            <h1>{t('account.login_with')} <span className="selected-text">Instend ID</span></h1>
            <p className='page-description'>{t('account.login_with.message')}</p>
            <InputText placeholder={t('account.email_or_nickname')} SetValue={setEmail} autofocus={true} />
            <InputPassword placeholder={t('account.password')} SetValue={setPassword} autofocus={false} />
            <div className='margin-top-40'>
                <Button title={t('account.login')} state={formState} onClick={() => Authorize()} />
            </div>
            <Line title={t('account.or')} />
            <div className='external-links margin-top-20'>
                <div className='external-link'>
                    <p>{t('account.dont_have_account')}</p>
                    <Link to="/account/create/email">{t('account.registration')}</Link>
                </div>
                <Link to="/account/password/recovery/email">{t('account.forgot_password')}</Link>
            </div>
        </GoogleOAuthProvider>
    );
});

export default Login;