import { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import { useParams } from 'react-router-dom';
import { GetMessageDateIfItNessecery, GetMessagePosition } from '../../../pages/messages/widgets/chat/helpers/MessageActions';
import styles from './main.module.css';
import ChatsState from '../../../../../state/entities/ChatsState';
import Message from '../../../pages/messages/shared/message/Message';
import AccountState from '../../../../../state/entities/AccountState';

const MessageList = observer(({chat, scroll}) => {
    const wrapper = useRef();
    const scrollRef = useRef();
    const [isHasMore, setHaseMoreState] = useState(true);

    const { GetMessages } = ChatsState;
    const { account } = AccountState;
    
    let params = useParams();

    const HandleScroll = async () => {
        if (scrollRef && scrollRef.current && isHasMore === true) {
            const offsetTop = scrollRef.current.getBoundingClientRect().top;

            if (offsetTop > 0 && chat.hasMore === true) {
                const timeoutMilliseconds = 7000;
                const getMessagesPromise = GetMessages(params.id);

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
        if (scroll && scroll.current) {
            scroll.current.addEventListener('scroll', HandleScroll);
        }
    
        return () => {
            if (scroll && scroll.current) {
                scroll.current.removeEventListener('scroll', HandleScroll);
            }
        };
    }, []);

    useEffect(() => {
        HandleScroll();
    }, [params.id, chat?.messages]);

    return (
        <div className={styles.messages} ref={wrapper}>
            <div ref={scrollRef}></div>
            {chat.messages && chat.messages
                .map((message, index) => {
                    const position = GetMessagePosition(message, chat, index);
                    const date = GetMessageDateIfItNessecery(message, chat, index);
                    const isCurrentAccountMessage = message.accountId === account.id;

                    return (
                        <div key={message.id ?? index} data={message.id}>
                            {date && <div className={styles.date}>
                                <span>{date}</span>
                            </div>}
                            <Message
                                position={position}
                                message={message} 
                                isCurrentAccountMessage={isCurrentAccountMessage}
                            /> 
                        </div>
                    );
                })}
        </div>
    );
});

export default MessageList;