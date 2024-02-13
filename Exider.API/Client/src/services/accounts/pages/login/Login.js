import { Link } from 'react-router-dom';
import GoogleOAuth from '../../features/google-oauth/GoogleOAuth';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import InputPassword from "../../shared/password/InputPassword";
import Line from '../../shared/line/Line';
import Content from "../../widgets/content/Content";
import './main.css';

const Login = () => {

    return (

        <Content>
            <h1>Login with <span className="selected-text">Exider ID</span></h1>
            <p>We will check if your account exist. Your email or nickname<br /> sholdn't be empthy.</p>
            <InputText placeholder="Email or nickname" autofocus={true} />
            <InputPassword placeholder="Password" autofocus={false} />
            <Button title="Login" active={false} />
            <Line title="or" />
            <GoogleOAuth />
            <div className='external-links'>
                <div className='external-link'>
                    <p>Don't have an account?</p>
                    <Link to="/account/create/email">Registration</Link>
                </div>
                <Link to="/">Forgot a password?</Link>
            </div>
        </Content>

    );

}

export default Login;