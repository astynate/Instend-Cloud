import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import MessangerHeader from "../components/Header/MessangerHeader";
import MessageList from "../components/MessageList/MessageList";
import chatsState from "../../../../../../../states/chats-state";
import styles from './main.module.css';
import ChatPlaceholder from "../components/placeholder/ChatPlaceholder";

const Draft = observer(({operation, setDefaultOperation}) => {
    return (
        <>
            <MessangerHeader 
                avatar={chatsState.draft.avatar}
                title={chatsState.draft.name}
                subTitle={"Draft personal chat"}
                isChatInformation={false}
                setChatInformation={() => {}}
            />
            <div className={styles.draftBody}>
                <ChatPlaceholder 
                    title={"There are no messages here"} 
                    subTitle={"Write a message to start chatting"} 
                />
            </div>
            <Input
                operation={operation}
                setDefaultOperation={setDefaultOperation}
                chat={chatsState.draft}
            />
        </>
    );
});

export default Draft;