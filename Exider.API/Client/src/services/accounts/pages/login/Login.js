import { useNavigate } from 'react-router-dom';
import Button from '../../shared/button/Button';
import InputText from "../../shared/input/InputText";
import Content from "../../widgets/content/Content";

const Login = () => {

    const navigation = useNavigate();

    return (

        <Content>
            <h1>Login with <span className="selected-text">Exider ID</span></h1>
            <p>We will check if your account exist. Your email or nickname<br /> sholdn't be empthy.</p>
            <InputText placeholder="Email or nickname" autofocus="true" />
            <Button title="Next" />
            <span onClick={() => navigation(-1)} className='back'>Back</span>
        </Content>

    );

}

export default Login;