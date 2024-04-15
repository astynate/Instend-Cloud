import React, { useState, createContext } from 'react';
import AccessPicker from '../widgets/access-picker/AccessPicker';
import OpenAccess from '../widgets/open-access/OpenAccess';
import { instance } from '../../../../../state/Interceptors';

export const OpenAccessContext = createContext();

const OpenAccessProcess = (props) => {
    const [state, setState] = useState('AccessPicker');
    const [access, setAccess] = useState(props.access || "private");
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [isSearching, setSearchingState] = useState(false);

    const SendAccessRequest = async (access, users) => {
        await instance.post(`/access?id=${props.id || ""}&type=${access}`, users.map(x => ({id: x.id, ability: x.ability})));
    };

    useState(() => {
        const GetAccessState = async () => {
            const response = await instance.get(`/access?id=${props.id || ""}`);
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
                send={() => SendAccessRequest(access, users)}
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

    return (
        <OpenAccessContext.Provider value={{
            users, 
            setUsers, 
            searchUsers, 
            setSearchUsers, 
            isSearching, 
            setSearchingState
        }}>
            {components[state]}
        </OpenAccessContext.Provider>
    );
};

export default OpenAccessProcess;