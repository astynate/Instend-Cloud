import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { MessageOperations } from "./helpers/MessageOperations";
import styles from './main.module.css';
import ChatTypes from "./helpers/ChatTypes";
import ChatsState from "../../../../../../state/entities/ChatsState";
import ChatHandler from "../../../../../../utils/handlers/ChatHandler";
import MessangerController from "../../../../api/MessangerController";

const Chat = observer(({isMobile, isOpen, chat}) => {
    const [prevHeight, SetPrevHeight] = useState(0);
    const [operation, setOperation] = useState(MessageOperations[0]);
    const [currentChatType, setCurrentChatTypeState] = useState(ChatTypes.notSelect);
    const [isRightPanelOpen, setRightPanelOpenState] = useState(false);
    
    const params = useParams();
    const scrollElement = useRef();

    const { draft, setDraft, chats } = ChatsState;
    
    useEffect(() => {
        if (draft) {
            setCurrentChatTypeState(ChatTypes.draft);
            return;
        };

        if (!params.id) {
            setCurrentChatTypeState(ChatTypes.notSelect);
            return;
        };

        setDraft(null);
        setCurrentChatTypeState(ChatHandler.GetChatHandlerByType(ChatHandler.GetChat(params.id)));
    }, [params, draft, chats]);

    useEffect(() => {
        if (chat && chat.isHasMore && chat.id) {
            MessangerController.GetMessages(
                chat.id, 
                chat, 
                ChatsState.addUniqueMessages
            );
        }
    }, [chat, chat?.messages]);

    useEffect(() => {
        if (scrollElement.current) {
            let element = scrollElement.current;
            let currentHeight = element.scrollHeight;
    
            let scrollDifference = currentHeight - prevHeight;
            element.scrollTop += scrollDifference;
    
            SetPrevHeight(currentHeight);
        };
    }, [scrollElement, scrollElement.current, scrollElement.current?.scrollHeight, chat?.messages, chat?.messages?.length]);

    if (isMobile === true && isOpen === false) {
        return null;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.chat} id={isMobile ? 'mobile' : null}>
                <currentChatType.object
                    operation={operation}
                    setDefaultOperation={() => setOperation(MessageOperations[0])}
                    chat={chat}
                    setRightPanelOpenState={setRightPanelOpenState}
                    scrollElement={scrollElement}
                />
            </div>
            {isRightPanelOpen && currentChatType.information && 
                <div className={styles.rightPanel}>
                    <currentChatType.information 
                        chat={chat}
                    />
                </div>}
        </div>
    );
});

export default Chat;