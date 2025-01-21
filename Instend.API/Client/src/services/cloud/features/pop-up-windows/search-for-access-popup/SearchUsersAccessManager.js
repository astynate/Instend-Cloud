import { useContext, useState } from 'react';
import { OpenAccessContext } from '../../../process/open-access/OpenAccessProcess';
import styles from './main.module.css';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';
import Search from '../../../shared/popup-windows/pop-up-window/elements/search/Search';
import Friends from '../access-picker-popup/items/friends/Friends';
import SavedState from '../access-picker-popup/widgets/saved-state/SavedState';

const SearchUsersAccessManager = ({
        open = false,
        users = [],
        back = () => {},
        close = () => {}, 
        fetchData = () => {}
    }) => {
    
    const [isLoading, setLoadingState] = useState(false);
    const context = useContext(OpenAccessContext);

    const onSucces = (users) => {
        context.setFoundUsers(users);
        setLoadingState(false);
    };

    const onError = () => {
        context.setFoundUsers([]);
        setLoadingState(false);
    };

    return (
        <PopUpWindow
            open={open}
            close={close}
            back={back}
            title={"Manage access"}
        >
            <div className={styles.openAccessWrapper}>
                <div className={styles.header}>
                    <Search
                        isLoading={isLoading}
                        setSearchResult={context.setFoundUsers}
                        setLoadingState={setLoadingState}
                        fetchData={(prefix) => fetchData(prefix, onSucces, onError)}
                    />
                </div>
                <Friends
                    isLoading={isLoading}
                    foundUsers={context.foundUsers} 
                    users={users}
                />
                <SavedState 
                    state={context.isSaved}
                    text={context.isSaved ? '' : 'To apply changes please go back to the previous page and click save button.'}
                />
            </div>
        </PopUpWindow>
    );

};

export default SearchUsersAccessManager;