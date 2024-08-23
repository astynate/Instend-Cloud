import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import MessangerHeader from "../components/Header/MessangerHeader";
import MessageList from "../components/MessageList/MessageList";
import ChatPlaceholder from "../components/placeholder/ChatPlaceholder";
import styles from './main.module.css';
import userState from "../../../../../../../states/user-state";

const Direct = observer(({operation, setDefaultOperation, chat, scrollElement}) => {
    const isUserInviter = () => {
        return chat.ownerId === userState.user.id;
    }

    return (
        <>
            <MessangerHeader 
                avatar={chat.avatar}
                title={chat.name}
                subTitle={"last seen recently"}
            />
            {!chat.isAccepted && 
                <div className={styles.middle}>
                    <ChatPlaceholder 
                        title={isUserInviter() ? "Invitation sent" : "You receive a chat ivent"}
                        subTitle={"If you want to chat with this user click accept"} 
                    />
                </div>
            }
            <MessageList 
                chat={chat} 
                scroll={scrollElement} 
            />
            {chat.isAccepted ? 
                <Input
                    operation={operation}
                    setDefaultOperation={setDefaultOperation}
                    chat={chat}
                />
            :
                <div className={styles.inputPlaceholder}>
                    <button className={styles.accept}>Accept</button>
                    <button className={styles.reject}>Reject</button>
                </div>
            }
        </>
    );
});

export default Direct;