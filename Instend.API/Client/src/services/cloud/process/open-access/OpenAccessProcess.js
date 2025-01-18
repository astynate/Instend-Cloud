import React, { useState, createContext } from 'react';
import { observer } from 'mobx-react-lite';
import AccessPicker from '../../features/pop-up-windows/access-picker-popup/AccessPicker';
import SearchUsersAccessManager from '../../features/pop-up-windows/search-for-access-popup/SearchUsersAccessManager';

export const OpenAccessContext = createContext();

const OpenAccessProcess = observer(({
        isOpen = false,
        access = 0, 
        SendAccessRequest = () => {}, 
        GetAccessState = () => {},
        GetData = () => {},
        close = () => {}
    }) => {

    const [state, setState] = useState('AccessPicker');
    const [newAccess, setNewAccess] = useState(access || 0);
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [isSearching, setSearchingState] = useState(false);
    const [isLoading, setLoadingState] = useState(false);

    const components = {
        'AccessPicker': (
            <AccessPicker
                next={() => setState('OpenAccess')}
                close={close}
                access={newAccess}
                setAccess={setNewAccess}
                callback={() => SendAccessRequest(access, users)}
                isLoading={isLoading}
            />
        ),
        'OpenAccess': (
            <SearchUsersAccessManager
                open={state === 'OpenAccess'}
                back={() => setState('AccessPicker')}
                close={close}
            />
        )
    };

    if (isOpen === false) {
        return null;
    }

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
});

export default OpenAccessProcess;