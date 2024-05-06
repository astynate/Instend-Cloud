import React, { useState, createContext } from 'react';
import AccessPicker from '../widgets/access-picker/AccessPicker';
import OpenAccess from '../widgets/open-access/OpenAccess';
import { instance } from '../../../../../state/Interceptors';

export const OpenAccessContext = createContext();

const OpenAccessProcess = (props) => {
    const [state, setState] = useState('AccessPicker');
    const [access, setAccess] = useState(props.access || 0);
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [isSearching, setSearchingState] = useState(false);
    const [isLoading, setLoadingState] = useState(true);

    const GetData = async (prefix) => {
        setLoadingState(true);

        try {
            await instance
                .get(`/accounts/all/${prefix}`)
                .then(response => {
                    setSearchUsers(response.data);
                });
        } finally {
            setLoadingState(false);
        }
    }

    const SendAccessRequest = async (access, users) => {
        await instance.post(`/access?id=${props.id || ""}&type=${access}`, 
            users.map(x => ({id: x.id, ability: x.ability})));
    };

    useState(() => {
        const GetAccessState = async () => {
            const response = await instance.get(`/access?id=${props.id || ""}`);
            setAccess(response.data[0] ? response.data[0] : 0);
        
            if (response.data[1]) {
                setUsers(response.data[1].map(element => ({
                    id: element.user.id,
                    name: element.user.name,
                    surname: element.user.surname,
                    nickname: element.user.nickname,
                    avatar: element.base64Avatar,
                    ability: element.access.ability
                })));
            }

            setLoadingState(false);
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
                isLoading={isLoading}
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
            setSearchingState,
            GetData
        }}>
            {components[state]}
        </OpenAccessContext.Provider>
    );
};

export default OpenAccessProcess;