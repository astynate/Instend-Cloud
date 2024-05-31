import React, { useEffect, useRef } from 'react';
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

const Chat = observer(({chat, placeholder}) => {
    const params = useParams();
    const { user } = userState;
    const scrollRef = useRef();

    const GetMessageUser = (user, id) => {
        if (chat.id === user.id) {
            return user;
        } else {
            return chatsState.users.find(user => user.id === id);
        }
    }

    const HandleScroll = () => {
        if (scrollRef && scrollRef.current) {
            const offsetTop = scrollRef.current.getBoundingClientRect().top;

            if (offsetTop > 0) {
                chatsState.GetMessages(params.id);
            }
        }
    }

    useEffect(() => {
        HandleScroll();
    }, []);

    return (
        <div className={styles.chat} onScroll={HandleScroll}>
            <div className={styles.header}>
                <div className={styles.left}>
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
                    />
                </div>
            </div>
            {chatsState.draft ? 
                (placeholder) 
            : (
                <div className={styles.messages}>
                    <div ref={scrollRef}></div>
                    {chat.messages.map((element, index) => {
                        const messageUser = GetMessageUser(user, element.userId);
                        let position = 3;

                        // if (index === chat.messages.length - 1) {
                        //     position = 3;
                        // } else if (index < chat.messages.length - 1 && chat.messages[index + 1].userId === ) {

                        // }

                        // if (index < chat.messages.length - 1 && chat.messages[index + 1] ===)

                        if (user && user.avatar) {
                            return (
                                <Message
                                    key={index}
                                    name={null}
                                    text={element.Text}
                                    avatar={user.avatar}
                                    type={element.id === userState.user.id ? 'My' : 'other'}
                                    position={3}
                                />
                           );
                        } else {
                           return null;
                        }
                    })}
                </div>
            )}
            <div className={styles.input}>
                <Input 
                    sendMessage={(message) => {
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
                        }
                    }}
                />
            </div>
        </div>
    );
});

export default Chat;