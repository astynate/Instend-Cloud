import GoogleOAuth from '../../features/google-oauth/GoogleOAuth';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import Line from '../../shared/line/Line';
import Content from "../../widgets/content/Content";
import './main.css';

const Login = () => {

    return (

        <Content>
            <h1>Login with <span className="selected-text">Exider ID</span></h1>
            <p>We will check if your account exist. Your email or nickname<br /> sholdn't be empthy.</p>
            <InputText placeholder="Email or nickname" autofocus={true} />
            <InputText placeholder="Password" autofocus={false} />
            <Button title="Login" active={false} />
            <Line title="or" />
            <GoogleOAuth />
            <div className='external-links'>
                <div className='external-link'>
                    <p clas>Don't have an account?</p>
                    <a href="/register">Registration</a>
                </div>
                <a href="/">Forgot a password?</a>
            </div>
        </Content>

    );

}

export default Login;