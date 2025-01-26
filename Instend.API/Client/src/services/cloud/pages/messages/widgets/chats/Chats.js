import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import create from './images/create.png';
import styles from './main.module.css';
import SearchInChat from '../../shared/search-in-chat/SearchInChat';
import CreateGroup from '../../features/create-group/CreateGroup';
import NewMessage from '../../features/new-message/NewMessage';

const Chats = observer(({isMobile, setOpenState = () => {}}) => {
    const [isCreateOpen, setCreateOpenState] = useState(false);
    const [isCreateDirect, setCreateDirectState] = useState(false);
    const [isCreateGroup, setCreateGroupState] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
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
        <div className={styles.chats} id={isMobile ? 'mobile' : null}>
            <div className={styles.header}>
                <div className={styles.top}>
                    <h1>Messages</h1>
                    <div className={styles.create} onClick={() => setCreateOpenState(p => !p)} ref={ref}>
                        <img 
                            src={create}
                            className={styles.createImage}
                            draggable="false"
                        />
                        {isCreateOpen && <div className={styles.popup}>
                            <span className={styles.item} onClick={() => setCreateDirectState(true)}>Direct</span>
                            <span className={styles.item} onClick={() => setCreateGroupState(true)}>Group</span>
                        </div>}
                    </div>
                </div>
            </div>
            <CreateGroup
                open={isCreateGroup} 
                close={() => setCreateGroupState(false)} 
            />
            <div className={styles.search}>
                <SearchInChat />
            </div>
            <NewMessage
                mainTitle={"New message"}
                open={isCreateDirect}
                close={() => setCreateDirectState(false)}
            />
        </div>
    );
});

export default Chats;