import React, { useState } from 'react';
import styles from './main.module.css'
import AccessPicker from '../widgets/access-picker/AccessPicker';
import OpenAccess from '../widgets/open-access/OpenAccess';

const OpenAccessProcess = (props) => {
    const [state, setState] = useState('AccessPicker');

    const components = {
        'AccessPicker': (
            <AccessPicker 
                next={() => setState('OpenAccess')}
                close={props.close}
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
