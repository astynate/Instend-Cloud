import React, { useState, createContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import AccessPicker from '../../features/pop-up-windows/access-picker-popup/AccessPicker';
import SearchUsersAccessManager from '../../features/pop-up-windows/search-for-access-popup/SearchUsersAccessManager';

export const OpenAccessContext = createContext({});

const OpenAccessProcess = observer(({
        isOpen = false,
        sendAccessRequest = () => {}, 
        getItem = () => {},
        fetchData = () => {},
        close = () => {}
    }) => {

    const [state, setState] = useState('AccessPicker');
    const [item, setItem] = useState(undefined);
    const [access, setAccess] = useState(0);
    const [users, setUsers] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [isSearching, setSearchingState] = useState(false);
    const [isSaved, setSavedState] = useState(true);
    const [isLoading, setLoadingState] = useState(false);

    const onSucces = (item) => {
        setItem(item);
        setLoadingState(false);
    }

    const onError = () => {
        close();
        setLoadingState(false);
    }

    useEffect(() => {
        getItem(onSucces, onError);
    }, []);

    useEffect(() => {
        if (!!item === true) {
            setUsers(item.accountsWithAccess);
            setAccess(item.access);
        };
    }, [item]);

    const components = {
        'AccessPicker': (
            <AccessPicker
                next={() => setState('OpenAccess')}
                close={close}
                access={access}
                users={users}
                setAccess={setAccess}
                callback={() => sendAccessRequest(access, users)}
                isLoading={isLoading}
            />
        ),
        'OpenAccess': (
            <SearchUsersAccessManager
                open={state === 'OpenAccess'}
                back={() => setState('AccessPicker')}
                fetchData={fetchData}
                close={close}
                users={users}
            />
        )
    };

    if (isOpen === false) {
        return null;
    }

    return (
        <OpenAccessContext.Provider value={{
            item,
            users, 
            setUsers, 
            foundUsers, 
            setFoundUsers,
            isSaved,
            setSavedState,
            isSearching, 
            setSearchingState,
            fetchData
        }}>
            {components[state]}
        </OpenAccessContext.Provider>
    );
});

export default OpenAccessProcess;