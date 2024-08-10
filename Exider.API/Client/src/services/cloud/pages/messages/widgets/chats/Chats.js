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

const DeleteDirectory = async (id) => {
    await instance.delete(`/api/directs?id=${id}`);
}

const Chats = observer(({isMobile, setOpenState}) => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const [isCreatePopUp, setCreatePopUpState] = useState(false);
    const [isContextMenuOpen, setContextMenuState] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [isDeleteOpen, setDeleteOpenState] = useState(false);
    const [id, setId] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const ref = useRef();

    useEffect(() => {
        const connectToChats = async () => {
            try {
                await WaitingForConnection(messageWSContext);

                if (messageWSContext.connection.state === 'Connected') {
                    await messageWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
                    chatsState.SetConnectedState(true);
                }
            } catch (error) {
                console.error('Failed to connect or join:', error);
                chatsState.SetConnectedState(false);
            }
        };

        if (chatsState.connected === false) {
            connectToChats();
        }
    }, [messageWSContext, messageWSContext.connection]);

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
                items={[
                    [null, 'Delete', () => {setDeleteOpenState(true)}]
                ]}
                close={() => setContextMenuState(false)}
            />}
            <OkCancel
                open={isDeleteOpen}
                close={() => setDeleteOpenState(false)}
                title={"Delete chat"}
                message={"Are you sure you want to permanently delete this chat for all participants?"}
                callback={() => {
                    if (id) {
                        DeleteDirectory(id);
                    }
                }}
            />
            <UsersPopUp
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
                                {title: "Chat", callback: () => setCreatePopUpState(true)},
                                // {title: "Group", callback: () => alert('!')}
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
                        const lastMessageA = a.messages && a.messages.length > 0 ? a.messages[a.messages.length - 1].Date : 0;
                        const lastMessageB = b.messages && b.messages.length > 0 ? b.messages[b.messages.length - 1].Date : 0;
                        return new Date(lastMessageB) - new Date(lastMessageA);
                    }).map((chat, index) => {
                        if (!chat || !chat.id) {
                            return null;
                        } else {
                            return (
                                <ChatPreview 
                                    key={index}
                                    chat={chat}
                                    isPlaceholder={false}
                                    isActive={chat.id === params.id}
                                    onClick={setOpenState}
                                    onContextMenu={(event) => {
                                        event.preventDefault();
                                        setContextMenuState(true);
                                        setContextMenuPosition([event.clientX, event.clientY]);
                                        setId(chat.id);
                                    }}
                                />
                            );
                        }
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