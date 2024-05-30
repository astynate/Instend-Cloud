import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';
import create from './images/create.png';
import ChatPreview from '../../shared/chat-preview/ChatPreview';
import PopUpList from '../../../../shared/ui-kit/pop-up-list/PopUpList';
import UsersPopUp from '../../shared/users-pop-up/UsersPopUp';
import { instance } from '../../../../../../state/Interceptors';
import chatsState from '../../../../../../states/chats-state';
import { messageWSContext } from '../../../../layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';

const Chats = observer(() => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const [isCreatePopUp, setCreatePopUpState] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const ref = useRef();

    useEffect(() => {
        const connectToChats = async () => {
            try {
                while (messageWSContext.connection.state !== 'Connected') {
                    if (messageWSContext.connection.state === 'Disconnected') {
                        await messageWSContext.connection.start();
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                await messageWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
                chatsState.SetConnectedState(true);
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
        <div className={styles.chats}>
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
                        navigate(`/messages/${user.id}`);
                        chatsState.setDraft(user);
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
                <Title title='Chats' />
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
            <div className={styles.chatList}>
                {chatsState.isChatsLoaded ? 
                    chatsState.chats.map((chat, index) => {
                        if (!chat || !chat.id) {
                            return null;
                        } else {
                            return (
                                <ChatPreview 
                                    key={index}
                                    chat={chat}
                                    isPlaceholder={false}
                                    isActive={chat.id === params.id}
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