import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import ValidLink from './ValidLink';
import InvalidLink from './InvalidLink';
import Loading from './Loading';

const Confirm = () => {

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

        return (linkValidationState === 'valid' ? <ValidLink email={email} link={id} /> : <InvalidLink />);

    }

}

export default Confirm;