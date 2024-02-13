import { Link } from 'react-router-dom';
import Code from "../../features/confirmation-code/Code";
import Content from "../../widgets/content/Content";
import Line from "../../shared/line/Line";

const Confirm = () => {

    const ResendConfirmationMain = async () => {

        const controller = new AbortController();
        const signal = controller.signal;

        const fetch('/confirmations', { signal })
            .then(response => response.json())
            .catch(err => console.error('Ошибка:', err));

        controller.abort();

    }

    return (

        <Content title="Confirm Email Address">
            <h1>Confirm your <span className="selected-text">Email</span></h1>
            <p>We have sent you a confirmation code to sicome.a.s@gmail.com<br /> Please enter the code in the field below</p>
            <Code />
            <div className='external-links'>
                <div className='external-link'>
                    <p>Didn't receive a confirmation?</p>
                </div>
                <div className='external-link'>
                    <Link onClick={() => ResendConfirmationMain()}>Resend confirmation code</Link>
                </div>
            </div>
            <Line />
        </Content>

    );

}

export default Confirm;