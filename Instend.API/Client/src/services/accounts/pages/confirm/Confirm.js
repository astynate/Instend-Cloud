import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import Loading from './Loading';

const Confirm = (props) => {

    const { id } = useParams();

    const [linkValidationState, setLinkState] = useState('loading');
    const [email, setEmail] = useState('');

    useEffect(() => {

        const fetchData = async () => {

            try {

                const controller = new AbortController();
                const { signal } = controller;

                const timeoutId = setTimeout(() => controller.abort(), 7000);

                const response = await fetch('/confirmations/link/' + 
                    id.toString(), { signal });

                if (response.status === 200) {

                    const responseData = await response.text();

                    setLinkState('valid');
                    setEmail(responseData);

                } else {

                    setLinkState('invalid');

                }

                clearTimeout(timeoutId);

            } catch (error) {

                setLinkState('invalid');

            }

        };
      
        fetchData();

    }, [id, email]);

    if (linkValidationState === 'loading') {

        return (<Loading />);

    } else {

        return (linkValidationState === 'valid' ? <props.valid email={email} link={id} /> : <props.invalid />);

    }

}

export default Confirm;