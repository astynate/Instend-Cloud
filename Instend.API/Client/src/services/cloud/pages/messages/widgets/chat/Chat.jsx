// import React, { useEffect, useRef, useState } from 'react';
// import styles from './main.module.css';
// import chatsState from '../../../../../../states/ChatsState';
// import { observer } from 'mobx-react-lite';
// import { useParams } from 'react-router-dom';
// import ChatInformation from '../../features/chat-information/ChatInformation';
// import reply from './images/context-menu/reply.svg';
// import copy from './images/context-menu/copy.svg';
// import pin from './images/context-menu/pin.svg';
// import save from './images/context-menu/save.svg';
// import deleteIcon from './images/context-menu/delete.svg';
// import edit from './images/context-menu/edit.svg';
// import forward from './images/context-menu/forward.svg';
// import { MessageOperations } from './helpers/MessageOperations';
// import ChatTypes from './helpers/ChatTypes';
// import ChatHandler from '../../../../../../utils/handlers/ChatHandler';

const Chat = observer(({isMobile, isOpen, close, chat, placeholder, requestSended}) => {
    // const params = useParams();
    // const scrollElement = useRef();
    // const [open, setOpenState] = useState(false);
    // const [prevHeight, SetPrevHeight] = useState(0);
    // const [operation, setOperation] = useState(MessageOperations[0]);
    // const [currentChatType, setCurrentChatTypeState] = useState(ChatTypes.notSelect);

    // useEffect(() => {
    //     if (params.id) {
    //         chatsState.setDraft(null);
    //         setCurrentChatTypeState(ChatHandler.GetChatHandlerByType(ChatHandler.GetChat(params.id)));
    //     } else {
    //         setCurrentChatTypeState(chatsState.draft ? ChatTypes.draft : ChatTypes.notSelect);
    //     }
    // }, [params]);

    // useEffect(() => {
    //     if (scrollElement.current) {
    //         let element = scrollElement.current;
    //         let currentHeight = element.scrollHeight;
    
    //         let scrollDifference = currentHeight - prevHeight;
    //         element.scrollTop += scrollDifference;
    
    //         SetPrevHeight(currentHeight);
    //     }
    // }, [scrollElement, scrollElement.current, scrollElement.current?.scrollHeight, chat?.messages, chat?.messages?.length]);

    // if (isMobile === true && isOpen === false) {
    //     return null;
    // }

    // return (
    //     <div 
    //         className={styles.chat} 
    //         ref={scrollElement}
    //         id={isMobile ? 'mobile' : null}
    //     >
    //         {/* {chat && chat.name && chat.avatar && <ChatInformation 
    //             open={open}
    //             name={chat.name}
    //             avatar={chat.avatar}
    //             close={() => setOpenState(false)}
    //             title="Chat information"
    //         />} */}
    //         {currentChatType !== ChatTypes.notSelect && 
    //             <currentChatType.object 
    //                 operation={operation}
    //                 setDefaultOperation={() => setOperation(MessageOperations[0])}
    //                 chat={chat}
    //                 scrollElement={scrollElement}
    //             />}
    //     </div>
    // );
});

export default Chat;