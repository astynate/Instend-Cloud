import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import styles from './main.module.css';
import ChatHandler from '../../../../../handlers/ChatHandler';

const MessagesWrapper = observer(({children}) => {
    const [chat, setChat] = useState(undefined);
    const wrapperRef = useRef(null);
    const params = useParams();

    const scrollToBottom = () => {
        if (!wrapperRef.current) {
            return false;
        };

        const currentScrollPosition = wrapperRef.current.scrollTop;
        const maxScrollHeight = wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight;
    
        if (maxScrollHeight - currentScrollPosition > 50) {
            return false;
        };

        wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat, chat?.messages]);

    useEffect(() => {
        setChat(ChatHandler.GetChat(params.id));
    }, [params.id]);

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            {children}
        </div>
    );
});

export default MessagesWrapper;