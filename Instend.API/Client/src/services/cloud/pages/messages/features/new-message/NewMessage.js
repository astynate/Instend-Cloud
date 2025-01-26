import { useState } from "react";
import Search from "../../../../shared/popup-windows/pop-up-window/elements/search/Search";
import PopUpWindow from "../../../../shared/popup-windows/pop-up-window/PopUpWindow";
import styles from './main.module.css';
import AccountController from "../../../../../../api/AccountController";
import StorageController from "../../../../../../api/StorageController";
import AccountState from "../../../../../../state/entities/AccountState";
import ChatsState from "../../../../../../state/entities/ChatsState";

const NewMessage = ({mainTitle, open, close, callback = () => {}}) => {
    const [isLoading, setLoadingState] = useState(false);
    const [isSearching, setSearchingState] = useState(false);
    const [foundUsers, setFoundUsers] = useState([]);

    const { setDraft } = ChatsState;

    return (
        <PopUpWindow
            open={open}
            close={close}
            title={mainTitle}
        >
            <div className={styles.createChat}>
                <Search
                    setSearchResult={setFoundUsers}
                    setSearchingState={setSearchingState}
                    setLoadingState={setLoadingState}
                    fetchData={(prefix) => AccountController.GetAccountsByPrefix(prefix, setFoundUsers)}
                />
                <div className={styles.accounts}>
                    {foundUsers
                        .filter(a => a.id !== AccountState.account.id)
                        .map((account) => {
                            return (
                                <div 
                                    key={account.id} 
                                    className={styles.account}
                                    onClick={() => {
                                        setDraft(account);
                                        callback();
                                        close();
                                    }}
                                >
                                    <img
                                        src={StorageController.getFullFileURL(account.avatar)}
                                        draggable="false" 
                                        className={styles.avatar}
                                    />
                                    <h1>{account.name} {account.surname}</h1>
                                    <span>{account.nickname}</span>
                                </div>
                            )
                        })}
                </div>
            </div>
        </PopUpWindow>
    );
};

export default NewMessage;