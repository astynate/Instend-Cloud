import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import create from './images/create.png';
import styles from './main.module.css';
import remove from './images/remove.png';
import SearchField from '../../../../ui-kit/fields/search-field/SearchField';
import CreateGroup from '../../features/create-group/CreateGroup';
import NewMessage from '../../features/new-message/NewMessage';
import ChatsState from '../../../../../../state/entities/ChatsState';
import DirectsController from '../../../../api/DirectsController';
import ChatPreview from './features/chat-preview/ChatPreview';
import ChatsHelper from './ChatsHelper';
import SortingHandler from '../../../../../../handlers/SortingHandler';
import GroupsController from '../../../../api/GroupsController';
import ContextMenu from '../../../../shared/context-menus/context-menu/ContextMenu';

const Chats = observer(({isMobile, setOpenState = () => {}}) => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const [isCreateDirect, setCreateDirectState] = useState(false);
    const [isCreateGroup, setCreateGroupState] = useState(false);
    const ref = useRef();

    const { isHasMoreDirects, isHasMoreGroups, chats, numberOfLoadedDirects, numberOfLoadedGroups } = ChatsState;
    
    useEffect(() => {
        if (isHasMoreDirects) {
            DirectsController.GetAccountsDirects(numberOfLoadedDirects, 5);
        };
    }, [numberOfLoadedDirects]);

    useEffect(() => {
        if (isHasMoreGroups) {
            GroupsController.GetGroups(numberOfLoadedGroups, 5);
        };
    }, [numberOfLoadedGroups]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setCreateOpenState(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <div className={styles.chats} id={isMobile ? 'mobile' : null}>
            <div className={styles.header}>
                <div className={styles.top}>
                    <h1>Messages</h1>
                    <div className={styles.create} onClick={() => setCreateOpenState(p => !p)} ref={ref}>
                        <img 
                            src={create}
                            className={styles.createImage}
                            draggable="false"
                        />
                        {isCreateOpen && <div className={styles.popup}>
                            <span className={styles.item} onClick={() => setCreateDirectState(true)}>Direct</span>
                            <span className={styles.item} onClick={() => setCreateGroupState(true)}>Group</span>
                        </div>}
                    </div>
                </div>
            </div>
            <CreateGroup
                open={isCreateGroup} 
                close={() => setCreateGroupState(false)} 
            />
            <div className={styles.search}>
                <SearchField />
            </div>
            <NewMessage
                mainTitle={"New message"}
                open={isCreateDirect}
                close={() => setCreateDirectState(false)}
            />
            <div className={styles.chatsWrapper}>
                {chats
                    .slice()
                    .sort((a, b) => SortingHandler.CompareTwoDates(a.data, b.data, true))
                    .map((chat) => {
                        const data = ChatsHelper.GetChatData(chat);
                        const items = [
                            { 
                                title: 'Delete', 
                                red: true, 
                                image: remove, 
                                callback: () => ChatsHelper.DeleteChat(chat)
                            }
                        ];

                        return (
                            <ContextMenu
                                key={chat.id}
                                items={items}
                            >
                                <ChatPreview 
                                    avatar={data.avatar}
                                    name={data.name}
                                    chat={chat}
                                />
                            </ContextMenu>
                        );
                    })}
            </div>
        </div>
    );
});

export default Chats;