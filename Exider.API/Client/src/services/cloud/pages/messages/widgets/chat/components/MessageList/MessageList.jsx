import { useEffect, useRef, useState } from "react";
import styles from './main.module.css';
import { useParams } from "react-router-dom";
import chatsState from "../../../../../../../../states/chats-state";
import ChatHandler from "../../../../../../../../utils/handlers/ChatHandler";
import { GetMessageDateIfItNessecery, GetMessagePosition } from "../../MessageActions";
import Message from "../../../../shared/message/Message";
import userState from "../../../../../../../../states/user-state";
import { observer } from "mobx-react-lite";
import { SpecialTypes } from "../../../../../../../../utils/handlers/SpecialType";

const MessageList = observer(({chat, scroll}) => {
    const wrapper = useRef();
    const scrollRef = useRef();
    const [isHasMore, setHaseMoreState] = useState(true);
    
    let params = useParams();

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
            {/* {chat && chat.messages && <SelectBox
                selectPlace={[wrapper]}
                selectedItems={[selectedItems, setSelectedItems]}
                activeItems={[activeItems, setActiveItems]}
                itemsWrapper={wrapper}
                items={chat.messages}
                single={isMyMessage ? senderSingleContext : receiverSingleContext}
                multiple={isMyMessage ? senderMultipleContext : receiverMultipleContext}
            />} */}
            <div ref={scrollRef}></div>
            {chat.messages && chat.messages.map((element, index) => {
                const avatar = ChatHandler.GetMessageUser(element).Avatar ?? ChatHandler.GetMessageUser(element).avatar;
                const position = GetMessagePosition(element, chat, index);
                const date = GetMessageDateIfItNessecery(element, chat, index);
                const sendingType = element.queueId ? 0 : element.IsViewed || element.isViewed ? 2 : 1;
                const key = sendingType === 0 ? index : element.Id;

                return (
                    <div key={key ?? index} data={element.Id}>
                        {date && <div className={styles.date}>
                            <span>{date}</span>
                        </div>}
                        <Message
                            id={element.Id ?? index}
                            name={null}
                            text={element.Text}
                            chatId={chat.directId ? chat.directId : params.id}
                            avatar={avatar}
                            key={key + element.IsViewed}
                            type={element.UserId === userState.user.id ? 'My' : 'Other'}
                            position={position}
                            time={element.Date}
                            attachments={element.attachments}
                            isSelected={false}
                            SpecialType={element.SpecialType ?? SpecialTypes.None}
                            sendingType={element.queueId ? 0 : element.IsViewed || element.isViewed ? 2 : 1}
                        /> 
                    </div>
                );
            })}
        </div>
    );
});

export default MessageList;