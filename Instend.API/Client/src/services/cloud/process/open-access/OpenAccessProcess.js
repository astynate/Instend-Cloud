import React, { useState, createContext, useEffect } from 'react';
import AccessPicker from '../../widgets/social/access/access-picker/AccessPicker';
import OpenAccess from '../../widgets/social/access/open-access/OpenAccess';
import { instance } from '../../../../state/Interceptors';
import applicationState from '../../../../states/application-state';
import { observer } from 'mobx-react-lite';

export const OpenAccessContext = createContext();

const OpenAccessProcess = observer((props) => {
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
        if (props.endPoint) {
            await instance
                .post(`/${props.endPoint}?id=${props.id || ""}&type=${access}`, users.map(x => ({id: x.id, ability: x.ability})))
                .then(() => {
                    GetAccessState();
                })
                .catch(error => {
                    applicationState.AddErrorInQueue('Attention!', error.response.data);
                })
        }
    };

    const GetAccessState = async () => {
        await instance
            .get(`/${props.endPoint}?id=${props.id || ""}`)
            .then(response => {
                setAccess(response.data[0] ? response.data[0] : 0);
    
                if (response.data[0] === 0 || response.data[0] === 2 && response.data[1] && props.accessSaveCallback) {
                    props.accessSaveCallback([response.data[1]]);
                } else if (response.data[0] === 1 && response.data[1]) {
                    setUsers(response.data[1].map(element => ({
                        id: element.user.id,
                        name: element.user.name,
                        surname: element.user.surname,
                        nickname: element.user.nickname,
                        avatar: element.base64Avatar,
                        ability: element.access.ability
                    })));

                    props.accessSaveCallback(response.data[1]);
                    
                    if (response.data[2]) {
                        props.accessSaveCallback([...response.data[1], response.data[2]]);
                    }
                }
    
                setLoadingState(false);

                if (props.setLoadingState) {
                    props.setLoadingState(false);
                }
            })
            // .catch(error => {
            //     // applicationState.AddErrorInQueue('Attention!', error.response.data);
            // });
    }

    useState(() => {
        if (props.endPoint) {
            GetAccessState();
        }
    }, []);

    const components = {
        'AccessPicker': (
            <AccessPicker
                next={() => setState('OpenAccess')}
                close={props.close}
                access={[access, setAccess]}
                send={() => {
                    SendAccessRequest(access, users);
                }}
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

    if (props.open) {
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
    } else {
        return null;
    }
});

export default OpenAccessProcess;