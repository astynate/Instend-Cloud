import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';
import create from './images/create.png';
import ChatPreview from '../../shared/chat-preview/ChatPreview';
import PopUpList from '../../../../shared/ui-kit/pop-up-list/PopUpList';

const Chats = observer(() => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const ref = useRef();

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
                                {title: "Chat", callback: () => alert('!')},
                                {title: "Group", callback: () => alert('!')}
                            ]}
                        />
                    </div>}
                </div>
            </div>
            <div className={styles.chatList}>
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
            </div>
        </div>
    );
});

export default Chats;