import { Link } from 'react-router-dom';
import GoogleOAuth from '../../features/google-oauth/GoogleOAuth';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import InputPassword from "../../shared/password/InputPassword";
import Line from '../../shared/line/Line';
import './main.css';
import { useTranslation } from 'react-i18next';

const Login = () => {

    const { t } = useTranslation();

    return (

        <>
            <h1>{t('account.login_with')} <span className="selected-text">Exider ID</span></h1>
            <p>{t('account.login_with.message')}</p>
            <InputText placeholder={t('account.email_or_nickname')} autofocus={true} />
            <InputPassword placeholder={t('account.password')} autofocus={false} />
            <Button title={t('account.login')} active={false} />
            <Line title={t('account.or')} />
            <GoogleOAuth />
            <div className='external-links'>
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