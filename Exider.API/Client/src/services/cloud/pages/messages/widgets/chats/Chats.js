import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';
import create from './images/create.png';
import ChatPreview from '../../shared/chat-preview/ChatPreview';
import PopUpList from '../../../../shared/ui-kit/pop-up-list/PopUpList';
import UsersPopUp from '../../shared/users-pop-up/UsersPopUp';
import { instance } from '../../../../../../state/Interceptors';
import chatsState from '../../../../../../states/chats-state';
import { WaitingForConnection, messageWSContext } from '../../../../layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import ContextMenu from '../../../../shared/context-menu/ContextMenu';
import OkCancel from '../../../../shared/ok-cancel/OkCancel';
import SearchInChat from '../../shared/search-in-chat/SearchInChat';
import CreateGroup from '../../features/create-group/CreateGroup';
import remove from './images/remove.png';
import ChatHandler from '../../../../../../utils/handlers/ChatHandler';
import ChatTypes from '../chat/ChatTypes';
import userState from '../../../../../../states/user-state';
import applicationState from '../../../../../../states/application-state';

export const DeleteDirectory = async (id) => {
    await instance.delete(`/api/directs?id=${id}`);
}

export const LeaveGroup = async (id) => {
    await instance.delete(`/api/groups?id=${id}`);
}

const Chats = observer(({isMobile, setOpenState}) => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const [isCreatePopUp, setCreatePopUpState] = useState(false);
    const [isContextMenuOpen, setContextMenuState] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [isDeleteOpen, setDeleteOpenState] = useState(false);
    const [isLeaveChatOpen, setLeaveChatOpenState] = useState(false);
    const [isBot, setBotState] = useState(false);
    const [isCreateGroup, setCreateGroupState] = useState(false);
    const [id, setId] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const ref = useRef();

    const directContextMenuItems = [[remove, 'Delete', () => {setDeleteOpenState(true)}, true]];
    const groupContextMenuItems = [[remove, 'Leave group', () => {setLeaveChatOpenState(true)}, true]];

    const [items, setItems] = useState(directContextMenuItems);

    useEffect(() => {
        const connectToChats = async () => {
            try {
                await WaitingForConnection(messageWSContext);

                if (messageWSContext.connection.state === 'Connected') {
                    const object = {
                        authorization: localStorage.getItem("system_access_token"),
                        count: chatsState.countLoadedChats
                    };

                    await messageWSContext.connection.invoke("Join", object);
                }
            } catch (error) {
                console.error('Failed to connect or join:', error);
                chatsState.SetConnectedState(false);
            }
        };

        if (chatsState.connected === false) {
            connectToChats();
        }
    }, [messageWSContext, messageWSContext.connection, chatsState.countLoadedChats]);

    useEffect(() => {
        function handleClickOutside(event) {
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
            {isContextMenuOpen && <ContextMenu 
                position={contextMenuPosition}
                isContextMenu={isContextMenuOpen}
                items={items}
                close={() => setContextMenuState(false)}
            />}
            <OkCancel
                open={isDeleteOpen}
                close={() => setDeleteOpenState(false)}
                title={"Delete chat"}
                message={"Are you sure want to permanently delete this chat for all participants?"}
                callback={() => {
                    if (id) {
                        DeleteDirectory(id);
                    }
                }}
            />
            <OkCancel
                open={isLeaveChatOpen}
                close={() => setLeaveChatOpenState(false)}
                title={"Leave group"}
                message={"Are you sure want to leave this group?"}
                callback={() => {
                    if (id) {
                        LeaveGroup(id);
                    }
                }}
            />
            <CreateGroup 
                open={isCreateGroup} 
                close={() => setCreateGroupState(false)} 
            />
            <UsersPopUp
                mainTitle={"Create direct"}
                title={"Next"}
                open={isCreatePopUp}
                close={() => setCreatePopUpState(false)}
                callback={() => {alert('!')}}
                searchUsers={searchUsers}
                setSearchResult={setSearchUsers}
                setSearchingState={() => {}}
                setLoadingState={() => {}}
                isHasSubmitButton={false}
                userCallback={(user) => {
                    if (user.id === userState.user.id) {
                        applicationState.AddErrorInQueue('Attantion!', `You can't chat with yourself!`);
                        return;
                    }

                    const chat = ChatHandler.GetChat(user.id);

                    if (chat) {
                        navigate(`/messages/${chat.id}`);
                        setCreatePopUpState(false);
                        return;
                    }

                    if (user.id) {
                        const result = chatsState.setDraft(user);
                        
                        if (result === true) {
                            navigate(`/messages`);
                        }
                    }

                    setCreatePopUpState(false);
                }}
                GetData={async (prefix) => {
                    await instance
                        .get(`/accounts/all/${prefix}`)
                        .then(response => {
                            setSearchUsers(response.data);
                        });
                }}
            />
            <div className={styles.header}>
                <Title value='Messages' />
                <div className={styles.create}>
                    <img 
                        src={create}
                        className={styles.createImage}
                        draggable="false"
                        onClick={() => setCreateOpenState(prev => !prev)}
                    />
                    {isCreateOpen && <div className={styles.createPopUp} ref={ref}>
                        <PopUpList
                            items={[
                                {title: "Direct", callback: () => {setCreatePopUpState(true); setCreateOpenState(false)}},
                                {title: "Group", callback: () => {setCreateGroupState(true); setCreateOpenState(false)}},
                                {title: "Application", callback: () => {setBotState(true); setCreateOpenState(false)}}
                            ]}
                        />
                    </div>}
                </div>
            </div>
            <div className={styles.search}>
                <SearchInChat />
            </div>
            <div className={styles.chatList}>
                {chatsState.isChatsLoaded ? 
                    chatsState.chats.slice().sort((a, b) => {
                        const lastMessageA = a.messages && a.messages.length > 0 ? a.messages[a.messages.length - 1].date : 0;
                        const lastMessageB = b.messages && b.messages.length > 0 ? b.messages[b.messages.length - 1].date : 0;
                        return new Date(lastMessageB) - new Date(lastMessageA);
                    }).map((chat) => {
                        if (!chat || !chat.id) { return null; }
                            
                        return (
                            <ChatPreview 
                                key={chat.id}
                                chat={chat}
                                isPlaceholder={false}
                                isActive={chat.id === params.id}
                                onClick={setOpenState}
                                onContextMenu={(event) => {
                                    event.preventDefault();

                                    switch (chat.type) {
                                        case 'direct': {
                                            setItems(directContextMenuItems);
                                            break;
                                        }
                                        case 'group': {
                                            setItems(groupContextMenuItems);
                                            break;
                                        }
                                    }

                                    setContextMenuState(true);
                                    setContextMenuPosition([event.clientX, event.clientY]);
                                    setId(chat.id);
                                }}
                            />
                        );
                    })
                :
                    Array.from({length: 20}).map((_, index) => {
                        return (
                            <ChatPreview 
                                key={index}
                                isPlaceholder={true}
                            />
                        )
                    })}
            </div>
        </div>
    );
});

export default Chats;