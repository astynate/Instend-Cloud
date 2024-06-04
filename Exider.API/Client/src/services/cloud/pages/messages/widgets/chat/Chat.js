import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import info from './images/header/info.png';
import Input from '../../shared/input/Input';
import chatsState from '../../../../../../states/chats-state';
import { observer } from 'mobx-react-lite';
import { messageWSContext } from '../../../../layout/Layout';
import applicationState from '../../../../../../states/application-state';
import { useParams } from 'react-router-dom';
import Message from '../../shared/message/Message';
import userState from '../../../../../../states/user-state';
import Loader from '../../../../shared/loader/Loader';
import { ConvertDate, IsDayDiffrent } from '../../../../../../utils/DateHandler';
import ChatInformation from '../../features/chat-information/ChatInformation';
import back from './images/header/arrow.png';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import { instance } from '../../../../../../state/Interceptors';
import PinnedMessages from '../../features/pinned-messages/PinnedMessages';

export const ChangeAccessStateAsync = async (id, isAccept) => {
    try {
        while (messageWSContext.connection.state !== 'Connected') {
            if (messageWSContext.connection.state === 'Disconnected') {
                await messageWSContext.connection.start();
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await messageWSContext.connection.invoke("ChangeAccessState", id, localStorage.getItem("system_access_token"), isAccept);
    } catch (error) {
        console.error('Failed to connect or join:', error);
    }
};

const CopyMessageText = (items) => {
    let text = "";

    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].Text) {
                text += items[i].Text;
            }
        }
    }

    navigator.clipboard.writeText(text)
        .catch(err => {
            console.log('Something went wrong', err);
        });
}

const DeleteMessages = async (items) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            await instance
                .delete(`/api/message?id=${items[i].id}`);
        }
    }
}

const ChangePinnedState = async (items, id) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (id) {
                await instance.put(`/api/message?chatId=${id}&messageId=${items[i].id}&state=${!items[i].IsPinned}`);
            }
        }
    }
}

const Chat = observer(({isMobile, isOpen, close, chat, placeholder, requestSended}) => {
    const params = useParams();
    const scrollRef = useRef();
    const wrapper = useRef();
    const scrollElement = useRef();
    const [isHasMore, setHaseMoreState] = useState(true);
    const [open, setOpenState] = useState(false);
    const [activeItems, setActiveItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [pinStateText, setPinStateText] = useState('Pin');
    const { user } = userState;

    const [isAvailable, setAvailbleState] = useState(!((chatsState.draft && chatsState.draft.messages && 
        chatsState.draft.messages.length > 0) || chat && !chat.isAccepted));
    
    const multiple = [
        [null, "Copy", () => {
            setActiveItems(prev => {
                CopyMessageText(prev);
                return prev;
            });
        }],
        [null, "Delete", () => {
            setActiveItems(prev => {
                DeleteMessages(prev);
                return prev;
            });
        }],
    ];

    const single = [
        [null, pinStateText, () => {
            setActiveItems(prev => {
                ChangePinnedState(prev, chat.directId);
                return prev;
            });
        }],
        ...multiple,
    ];

    useEffect(() => {
        setAvailbleState(!((chatsState.draft && chatsState.draft.messages && 
            chatsState.draft.messages.length > 0) || chat && !chat.isAccepted));
    }, [isAvailable, chatsState, chatsState.chats, chat, chat?.isAccepted]);

    useEffect(() => {
        if (params.id) {
            chatsState.setDraft(null);
        }
    }, [params]);

    useEffect(() => {
        if (scrollElement.current) {
            const element = scrollElement.current;
            element.scrollTo(0, element.scrollHeight);
        }
    }, [scrollElement, scrollElement.current, scrollElement.current?.scrollHeight, chat?.messages, chat?.messages?.length]);

    const HandleScroll = async () => {
        if (scrollRef && scrollRef.current && isHasMore === true) {
            const offsetTop = scrollRef.current.getBoundingClientRect().top;

            while (offsetTop > 0 && chat.hasMore === true) {
                const timeoutMilliseconds = 7000;

                let operationCompleted = false;
        
                const getMessagesPromise = chatsState.GetMessages(params.id);
    
                const timeoutId = setTimeout(() => {
                    operationCompleted = true;
                    return;
                }, timeoutMilliseconds);
        
                try {
                    await getMessagesPromise;
                    clearTimeout(timeoutId);
                    operationCompleted = true;
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
        
                if (operationCompleted) {
                    setHaseMoreState(true);
                } else {
                    console.warn('GetMessages operation did not complete within 7 seconds');
                }
            }
        }
    };
    
    useEffect(() => {
        HandleScroll();
    }, []);

    useEffect(() => {
        setActiveItems(prev => {
            if (prev.length > 0) {
                setPinStateText(prev[0].IsPinned ? 'Unpin' : 'Pin');
            }
            
            return prev;
        })
    }, [activeItems])

    let pinnedMessages = [];

    if (chat.messages) {
        pinnedMessages = chat.messages.filter(element => 
            element.IsPinned && element.IsPinned === true)
    }

    if (isMobile === true && isOpen === false) {
        return null;
    } else {
        return (
            <div 
                className={styles.chat} 
                onScroll={HandleScroll} 
                ref={scrollElement}
                id={isMobile ? 'mobile' : null}
            >
                {chat && chat.messages && <SelectBox
                    selectPlace={[wrapper]}
                    selectedItems={[selectedItems, setSelectedItems]}
                    activeItems={[activeItems, setActiveItems]}
                    itemsWrapper={wrapper}
                    items={chat.messages}
                    single={single}
                    multiple={multiple}
                />}
                {chat && chat.name && chat.avatar && <ChatInformation 
                    open={open}
                    name={chat.name}
                    avatar={chat.avatar}
                    close={() => setOpenState(false)}
                    title="Chat information"
                    profileAddition={
                        <span>0 Friends 0 Friends 0 Friends</span>
                    }
                />}
                <div className={styles.header}>
                    <div className={styles.chatInfo}>
                        <div className={styles.left} onClick={() => setOpenState(true)}>
                            {isMobile && 
                                <img 
                                    src={back} 
                                    className={styles.back} 
                                    onClick={close}
                                />}
                            <div className={styles.avatar}>
                                <img 
                                    src={`data:image/png;base64,${chatsState.draft ? chatsState.draft.avatar : chat.avatar}`}
                                    className={styles.avatarImage} 
                                    draggable="false"
                                />
                            </div>
                            <div className={styles.information}>
                                <span className={styles.name}>{chatsState.draft ? chatsState.draft.nickname : chat.name}</span>
                                <span className={styles.data}>last seen recently</span>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <img src={info} 
                                className={styles.buttonImage} 
                                draggable="false"
                                onClick={() => setOpenState(true)}
                            />
                        </div>
                    </div>
                    <div className={styles.pinnedMessages}>
                        {pinnedMessages && pinnedMessages.length > 0 && <PinnedMessages 
                            items={pinnedMessages}
                        />}
                    </div>
                </div>
                {chatsState.draft ? 
                    <>
                        {chatsState.draft.messages ?
                            <>
                                {chatsState.draft.isLoaded ?
                                    (requestSended)
                                :
                                    <div className={styles.loder}>
                                        <div className={styles.sendingText}>
                                            <h1>Sending Invite</h1>
                                            <span>Wait a minute</span>
                                        </div>
                                        <Loader />
                                    </div>}
                                <div className={styles.messages}>
                                    {chatsState.draft.messages.map((element, index) => {
                                            if (user && user.avatar) {
                                                return (
                                                    <Message
                                                        key={index}
                                                        name={null}
                                                        text={element.Text}
                                                        avatar={userState.user.avatar}
                                                        type={'My'}
                                                        position={3}
                                                        time={element.Date}
                                                    />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </>
                        :
                            (placeholder)
                        }
                    </>
                : (
                    <>
                        {isAvailable === false && user.id === chat.ownerId && (requestSended)}
                        {isAvailable === false && user.id !== chat.ownerId && 
                            <div className={styles.textInfo}>
                                <h1>Request for a chat</h1>
                                <span>If you accept, {chat && chat.name ? chat.name : null} can send you messages otherwise the chat will be deleted</span>
                            </div>
                        }
                        <div className={styles.messages} ref={wrapper}>
                            <div ref={scrollRef}></div>
                            {chat.messages.map((element, index) => {
                                let avatar = null;
                                let position = 3;
    
                                if (element.UserId === user.id) {
                                    avatar = user.avatar;
                                } else {
                                    avatar = chatsState.users.find(user => user.Id === element.UserId);
                                    
                                    if (avatar) {
                                        avatar = avatar.Avatar;
                                    }
                                }
    
                                if (avatar) {
                                    const prevMessage = chat.messages[index - 1];
                                    const nextMessage = chat.messages[index + 1];
    
                                    if (prevMessage && nextMessage && prevMessage.UserId === element.UserId && nextMessage.UserId === element.UserId) {
                                        if (nextMessage && nextMessage.Date && element && element.Date && IsDayDiffrent(nextMessage.Date, element.Date) === true) {
                                            position = 2;
                                        } else {
                                            if (prevMessage && prevMessage.Date && element && element.Date && IsDayDiffrent(prevMessage.Date, element.Date) === true) {
                                                position = 0;
                                            } else {
                                                position = 1;
                                            }
                                        }
                                    } else if (prevMessage && prevMessage.UserId === element.UserId) {
                                        if (prevMessage && prevMessage.Date && element && element.Date && IsDayDiffrent(prevMessage.Date, element.Date) === true) {
                                            position = 3;
                                        } else {
                                            position = 2;
                                        }
                                    } else if (nextMessage && nextMessage.UserId === element.UserId) {
                                        if (nextMessage && nextMessage.Date && element && element.Date && IsDayDiffrent(nextMessage.Date, element.Date) === true) {
                                            position = 3;
                                        } else {
                                            position = 0;
                                        }
                                    }
    
                                    let date = null;
    
                                    if (prevMessage && prevMessage.Date && element && element.Date) {
                                        date = IsDayDiffrent(prevMessage.Date, element.Date) === true ? ConvertDate(element.Date) : null;
                                    } else if (element && element.Date) {
                                        date = ConvertDate(element.Date);
                                    }
    
                                    return (
                                        <div key={index} data={element.Id}>
                                            {date && <div className={styles.date}>
                                                <span>{date}</span>
                                            </div>}
                                            <Message
                                                name={null}
                                                text={element.Text}
                                                avatar={avatar}
                                                type={element.UserId === user.id ? 'My' : 'Other'}
                                                position={position}
                                                time={element.Date}
                                                isSelected={selectedItems.map(e => e.id).includes(element.id) === true}
                                            /> 
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </>
                )}
                <div className={styles.input}>
                    {isAvailable === false ?
                        user.id === chat.ownerId ?
                            <div className={styles.inputPlaceholder}>
                                <span>You can't send messages</span>
                            </div>
                        :
                            <div className={styles.inputPlaceholder}>
                                <div className={styles.accept} onClick={() => ChangeAccessStateAsync(chat.directId, true)}>Accept</div>
                                <div className={styles.reject} onClick={() => ChangeAccessStateAsync(chat.directId, false)}>Reject</div>
                            </div>
                    :
                        <Input 
                            sendMessage={(message) => {
                                if (message === '' || !message) {
                                    return;
                                }
    
                                if (params.id) {
                                    try {
                                        messageWSContext.connection.invoke("SendMessage", {
                                            id: params.id,
                                            text: message,
                                            userId: localStorage.getItem("system_access_token"),
                                            type: 0
                                        });
                                    } catch {
                                        applicationState.AddErrorInQueue('Attention!', 'Something went wrong');
                                    }
                                } else if (chatsState.draft) {
                                    const messageModel = {
                                        Text: message,
                                        UserId: localStorage.getItem("system_access_token"),
                                        Date: new Date()
                                    }
    
                                    chatsState.SetDraftMessage(
                                        messageWSContext.connection.invoke("SendMessage", {
                                            id: chatsState.draft.id,
                                            text: message,
                                            userId: localStorage.getItem("system_access_token"),
                                            type: 0
                                        }),
                                        messageModel);
                                }
                            }}
                        />
                    }
                </div>
            </div>
        );
    }
});

export default Chat;