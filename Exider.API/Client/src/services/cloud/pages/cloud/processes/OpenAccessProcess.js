import React, { useState } from 'react';
import styles from './main.module.css'
import AccessPicker from '../widgets/access-picker/AccessPicker';
import OpenAccess from '../widgets/open-access/OpenAccess';
import { instance } from '../../../../../state/Interceptors';

const OpenAccessProcess = (props) => {
    const [state, setState] = useState('AccessPicker');
    const [access, setAccess] = useState(props.access || "private");

    useState(() => {
        const GetAccessState = async () => {
            const response = instance.get(`/access?id=${props.id || ""}`);
            setAccess(response ? response.data : "private");
        }

        GetAccessState();
    }, []);

    const components = {
        'AccessPicker': (
            <AccessPicker
                next={() => setState('OpenAccess')}
                close={props.close}
                access={[access, setAccess]}
            />
        ),
        'OpenAccess': (
            <OpenAccess
                open={state === 'OpenAccess'}
                back={() => setState('AccessPicker')}
                close={props.close}
            />
        )
    };

    return components[state] || null;
};

export default OpenAccessProcess;
