import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import MessangerHeader from "../components/Header/MessangerHeader";
import chatsState from "../../../../../../../states/ChatsState";
import styles from './main.module.css';
import ChatPlaceholder from "../components/chat-placeholder/ChatPlaceholder";
import MessageList from "../components/message-list/MessageList";
import PointsLoaderAnimation from "../../../../../shared/points-loader-animation/PointsLoaderAnimation";

const Draft = observer(({operation, setDefaultOperation, scrollElement}) => {
    return (
        <>
            <MessangerHeader 
                avatar={chatsState.draft.avatar}
                title={chatsState.draft.nickname}
                subTitle={"Draft personal chat"}
                isChatInformation={false}
                setChatInformation={() => {}}
            />
            {chatsState.draft.messages.length === 0 ?
                <div className={styles.draftBody}>
                    <ChatPlaceholder 
                        title={"There are no messages here"} 
                        subTitle={"Write a message to start chatting"} 
                    />
                </div>
            :
                <MessageList 
                    chat={chatsState.draft}
                    scroll={scrollElement}
                />
            }
            {chatsState.draft.messages.length === 0 ? 
                <Input
                    operation={operation}
                    setDefaultOperation={setDefaultOperation}
                    chat={chatsState.draft}
                />
            :
                <div className={styles.inputPlaceholder}>
                    <div className={styles.connecting}>
                        <PointsLoaderAnimation />
                    </div>
                </div>
            }
        </>
    );
});

export default Draft;