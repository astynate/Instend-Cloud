import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import ChatContentHeader from '../../../../features/chat-content-header/ChatContentHeader';
import styles from './main.module.css';
import StorageController from '../../../../../../../../../../api/StorageController';
import PopUpWindow from '../../../../../../../../shared/popup-windows/pop-up-window/PopUpWindow';
import Search from '../../../../../../../../shared/popup-windows/pop-up-window/elements/search/Search';
import CheckMark from '../../../../../../../../ui-kit/basic/check-mark/CheckMark';
import AccountController from '../../../../../../../../../../api/AccountController';
import GroupsController from '../../../../../../../../api/GroupsController';
import add from './images/plus.png';

const ChatMembers = observer(({chat, setCurrentHandler = () => {}}) => {
    const [isGroupMembersOpen, setGroupMembersOpenState] = useState(false);
    const [isLoading, setLoadingState] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const revereseAccountCheckedState = (id) => {
        setSearchResult(prev => {
            return prev.map(account => {
                if (account.id === id) {
                    account.isChecked = !(!!account.isChecked);
                };

                return account;
            })
        });
    };

    const setUniqueUsers = (users) => {
        const members = chat.members.map(m => m.accountId);
        const result = users.filter(u => !members.includes(u.id));
        
        setSearchResult(result);
    };

    const addGroupMembers = async () => {
        const memebrsToAdd = searchResult
            .filter(u => u.isChecked);

        await GroupsController.AddGroupMembers(
            chat.id, 
            memebrsToAdd,
            () => setGroupMembersOpenState(false),
            () => setGroupMembersOpenState(false)
        );
    };

    return (
        <div className={styles.wrapper}>
            <ChatContentHeader 
                title="Members" 
                back={() => setCurrentHandler(undefined)}
                rightItem={
                    <img 
                        src={add} 
                        className={styles.add} 
                        onClick={() => setGroupMembersOpenState(true)}
                        draggable="false"
                    />
                }
            />
            <PopUpWindow
                open={isGroupMembersOpen}
                close={() => setGroupMembersOpenState(false)}
                title={"Group members"}
            >
                <div className={styles.groupMembersWrapper}>
                    <Search 
                        fetchData={(prefix) => AccountController.GetAccountsByPrefix(prefix, setUniqueUsers)}
                        setLoadingState={setLoadingState}
                        setSearchResult={setUniqueUsers}
                    />
                    <div className={styles.foundAccounts}>
                        {searchResult.map(account => {
                            return (
                                <div 
                                    key={account.id} 
                                    className={styles.account}
                                    onClick={() => revereseAccountCheckedState(account.id)}
                                >
                                    <div className={styles.left}>
                                        <img 
                                            src={StorageController.getFullFileURL(account.avatar)}
                                            className={styles.avatar} 
                                        />
                                        <div className={styles.information}>
                                            <span className={styles.name}>{account.name} {account.surname}</span>
                                        </div>
                                    </div>
                                    <CheckMark 
                                        isActive={account.isChecked}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.bottomButton} onClick={addGroupMembers}>
                        <span className={styles.button}>Apply</span>
                    </div>
                </div>
            </PopUpWindow>
            <div className={styles.accounts}>
                {chat.members.map(member => {
                    if (!member.account) {
                        return null;
                    };

                    return (
                        <div key={member.id} className={styles.account}>
                            <div className={styles.left}>
                                <img 
                                    src={StorageController.getFullFileURL(member.account.avatar)} 
                                    className={styles.avatar} 
                                />
                                <div className={styles.information}>
                                    <span className={styles.name}>{member.account.name} {member.account.surname}</span>
                                    <span className={styles.role}>{member.roleId}</span>
                                </div>
                            </div>
                            {member.roleId !== 'Owner' && 
                                <div 
                                    className={styles.remove}
                                    onClick={() => GroupsController.RemoveGroupMember(chat.id, member.accountId)}
                                >Remove</div>}
                        </div>
                    )
                })}
            </div>
        </div>
    );
});

export default ChatMembers;