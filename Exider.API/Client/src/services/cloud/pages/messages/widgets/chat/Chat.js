import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import info from './images/header/info.png';
import Input from '../../shared/input/Input';
import chatsState from '../../../../../../states/chats-state';
import { instance } from '../../../../../../state/Interceptors';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { ConvertDate, IsDayDiffrent } from '../../../../../../utils/DateHandler';
import { ChangeAccessStateAsync, ChangePinnedState, CopyMessageText, DeleteMessages } from './MessageActions';
import Message from '../../shared/message/Message';
import userState from '../../../../../../states/user-state';
import Loader from '../../../../shared/loader/Loader';
import ChatInformation from '../../features/chat-information/ChatInformation';
import back from './images/header/arrow.png';
import SelectBox from '../../../../shared/interaction/select-box/SelectBox';
import PinnedMessages from '../../features/pinned-messages/PinnedMessages';
import reply from './images/context-menu/reply.svg';
import copy from './images/context-menu/copy.svg';
import pin from './images/context-menu/pin.svg';
import save from './images/context-menu/save.svg';
import deleteIcon from './images/context-menu/delete.svg';
import edit from './images/context-menu/edit.svg';
import forward from './images/context-menu/forward.svg';
import { MessageOperations } from './MessageOperations';

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
    const [prevHeight, SetPrevHeight] = useState(0);
    const [isMyMessage, SetMyMessageState] = useState(false);
    const [operation, setOperation] = useState(MessageOperations[0]);
    const { user } = userState;

    const [isAvailable, setAvailbleState] = useState(!((chatsState.draft && chatsState.draft.messages && 
        chatsState.draft.messages.length > 0) || chat && !chat.isAccepted));

    const saveMessageAction = [save, "Save", () => {setOperation(MessageOperations.Save)}];
    const replyMessageAction = [reply, "Reply", () => {setOperation(MessageOperations.Reply)}];
    const editMessageAction = [edit, "Edit", () => {setOperation(MessageOperations.Edit)}];
    const forwardMessageAction = [forward, "Forward", () => {setOperation(MessageOperations.Forward)}];

    const copyMessageAction = [copy, "Copy", () => {
        setActiveItems(prev => {
            CopyMessageText(prev);
            return prev;
        });
    }];

    const deleteMessageAction = [deleteIcon, "Delete", () => {
        setActiveItems(prev => {
            DeleteMessages(prev);
            return prev;
        });
    }, true];

    const pinMessageAction = [pin, pinStateText, () => {
        setActiveItems(prev => {
            ChangePinnedState(prev, chat.directId);
            return prev;
        });
    }];
    
    const senderMultipleContext = [
        copyMessageAction, 
        pinMessageAction, 
        saveMessageAction, 
        forwardMessageAction, 
        deleteMessageAction
    ];

    const senderSingleContext = [
        replyMessageAction,
        pinMessageAction, 
        editMessageAction, 
        copyMessageAction, 
        forwardMessageAction, 
        saveMessageAction, 
        deleteMessageAction
    ];

    const receiverMultipleContext = [
        copyMessageAction, 
        pinMessageAction, 
        forwardMessageAction, 
        saveMessageAction
    ];

    const receiverSingleContext = [
        replyMessageAction, 
        copyMessageAction, 
        pinMessageAction, 
        forwardMessageAction, 
        saveMessageAction
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
            let element = scrollElement.current;
            let currentHeight = element.scrollHeight;
    
            let scrollDifference = currentHeight - prevHeight;
            element.scrollTop += scrollDifference;
    
            SetPrevHeight(currentHeight);
        }
    }, [scrollElement, scrollElement.current, scrollElement.current?.scrollHeight, chat?.messages, chat?.messages?.length]);

    useEffect(() => {
        SetMyMessageState(activeItems
            .find(x => x.UserId === userState.user.id) !== undefined); 
    }, [activeItems, activeItems.length]);

    const HandleScroll = async () => {
        if (scrollRef && scrollRef.current && isHasMore === true) {
            const offsetTop = scrollRef.current.getBoundingClientRect().top;

            if (offsetTop > 0 && chat.hasMore === true) {
                const timeoutMilliseconds = 7000;
                const getMessagesPromise = chatsState.GetMessages(params.id);

                let operationCompleted = false;
    
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
    }, [params.id, chat.messages]);

    useEffect(() => {
        setActiveItems(prev => {
            if (prev.length > 0) {
                setPinStateText(prev[0].IsPinned ? 'Unpin' : 'Pin');
            }
            
            return prev;
        })
    }, [activeItems])

    let pinnedMessages = [];

    if (chat && chat.messages) {
        pinnedMessages = chat.messages.filter(element => 
            element.IsPinned && element.IsPinned === true)
    }

    if (isMobile === true && isOpen === false) {
        return null;
    }

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
                single={isMyMessage ? senderSingleContext : receiverSingleContext}
                multiple={isMyMessage ? senderMultipleContext : receiverMultipleContext}
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

                                const sendingType = element.queueId ? 0 : element.IsViewed || element.isViewed ? 2 : 1;
                                const key = sendingType === 0 ? index : element.Id;

                                return (
                                    <div key={key} data={element.Id}>
                                        {date && <div className={styles.date}>
                                            <span>{date}</span>
                                        </div>}
                                        <Message
                                            id={element.Id}
                                            name={null}
                                            text={element.Text}
                                            chatId={chat.directId ? chat.directId : params.id}
                                            avatar={avatar}
                                            key={key + element.IsViewed}
                                            type={element.UserId === user.id ? 'My' : 'Other'}
                                            position={position}
                                            time={element.Date}
                                            attachments={element.attachments}
                                            isSelected={selectedItems.map(e => e.id).includes(element.id) === true}
                                            sendingType={element.queueId ? 0 : element.IsViewed || element.isViewed ? 2 : 1}
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
                        operation={operation}
                        setDefaultOperation={() => {setOperation(MessageOperations[0])}}
                        messages={activeItems}
                        sendMessage={async (message, attachments) => {
                            if (message === '' || !message) { return; }
                            let form = new FormData();

                            if (params.id) 
                            {
                                for(let i = 0; i < attachments.length; i++){
                                    form.append('attachments', attachments[i]);
                                }
                                
                                form.append('id', params.id);
                                form.append('text', message);
                                form.append('type', 0);
                                form.append('queueId', chatsState.SetLoadingMessage(chat.directId ? chat.directId : chat.id, message, attachments));
                            } 
                            else if (chatsState.draft) 
                            {
                                form.append('text', message);
                                form.append('id', chatsState.draft.id);
                                form.append('type', 0);
                            }

                            await instance.post('api/message', form);
                        }}
                    />
                }
            </div>
        </div>
    );
});

export default Chat;