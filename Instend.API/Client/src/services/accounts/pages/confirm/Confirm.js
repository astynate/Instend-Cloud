import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import Loading from './Loading';
import ConfirmationController from '../../../../api/ConfirmationController';

const Confirm = (props) => {
    const { id } = useParams();
    const [linkValidationState, setLinkState] = useState('loading');
    const [email, setEmail] = useState('');

    useEffect(() => {
        ConfirmationController.Get(setLinkState, setEmail, id);
    }, [id, email]);

    if (linkValidationState === 'loading') {
        return (<Loading />);
    } else {
        return (linkValidationState === 'valid' ? <props.valid email={email} link={id} /> : <props.invalid />);
    };
};

export default Confirm;