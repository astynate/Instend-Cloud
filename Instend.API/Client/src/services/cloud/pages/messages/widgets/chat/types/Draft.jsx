import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import styles from './main.module.css';
import ChatPlaceholder from "../components/chat-placeholder/ChatPlaceholder";
import ChatHeader from "../components/chat-header/ChatHeader";
import ChatsState from "../../../../../../../state/entities/ChatsState";
import MessageList from "../../../../../features/lists/message-list/MessageList";

const Draft = observer(({operation, setDefaultOperation, scrollElement}) => {
    const { draft } = ChatsState;

    if (!draft) {
        return null;
    };

    return (
        <>
            <ChatHeader
                avatar={draft.avatar}
                title={draft.nickname}
                subTitle={"Draft personal chat"}
                isChatInformation={false}
                setChatInformation={() => {}}
            />
            {draft.messages.length === 0 ?
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
                />}
            <Input
                operation={operation}
                setDefaultOperation={setDefaultOperation}
                chat={draft}
                type={0}
            />
        </>
    );
});

export default Draft;