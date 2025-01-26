import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import styles from './main.module.css';
import ChatPlaceholder from "../components/chat-placeholder/ChatPlaceholder";
import ChatHeader from "../components/chat-header/ChatHeader";
import ChatsState from "../../../../../../../state/entities/ChatsState";
import MessageList from "../../../../../features/lists/message-list/MessageList";

const Draft = observer(({operation, setDefaultOperation, scrollElement}) => {
    const { draft } = ChatsState;

    return (
        <>
            <ChatHeader
                avatar={draft.avatar}
                title={draft.nickname}
                subTitle={"Draft personal chat"}
                isChatInformation={false}
                setChatInformation={() => {}}
            />
            <div className={styles.draftBody}>
                {/* <ChatPlaceholder 
                    title={"There are no messages here"} 
                    subTitle={"Write a message to start chatting"} 
                /> */}
            </div>
            {/* {draft.messages.length === 0 ?
                <div className={styles.draftBody}>
                    <ChatPlaceholder 
                        title={"There are no messages here"} 
                        subTitle={"Write a message to start chatting"} 
                    />
                </div>
            :
                <MessageList
                    chat={draft}
                    scroll={scrollElement}
                />
            } */}
            <Input
                operation={operation}
                setDefaultOperation={setDefaultOperation}
                chat={draft}
            />
        </>
    );
});

export default Draft;