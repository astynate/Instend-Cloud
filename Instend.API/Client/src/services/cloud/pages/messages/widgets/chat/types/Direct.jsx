import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import ChatHeader from "../components/chat-header/ChatHeader";
import styles from './main.module.css';
import ChatPlaceholder from "../components/chat-placeholder/ChatPlaceholder";
import AccountState from "../../../../../../../state/entities/AccountState";
import MessageList from "../../../../../features/lists/message-list/MessageList";
import Input from "../../../shared/input/Input";
import ChatsHelper from "../../chats/ChatsHelper";
import DirectsController from "../../../../../api/DirectsController";
import MessagesWrapper from "../../../../../features/wrappers/messages-wrapper/MessagesWrapper";

const Direct = observer(({chat, operation, setDefaultOperation, scrollElement}) => {
    let { account } = AccountState;
    const data = ChatsHelper.GetChatData(chat);
    
    if (!chat) {
        return null;
    }

    const isUserInviter = () => {
        return chat.ownerId === account.id;
    };
    
    return (
        <>
            <ChatHeader
                avatar={data.avatar}
                title={data.name}
                subTitle={"last seen recently"}
            />
            <MessagesWrapper>
                {!chat.isAccepted && 
                    <div className={styles.middle}>
                        <ChatPlaceholder
                            title={isUserInviter() ? "Invitation sent" : "You receive a chat ivent"}
                            subTitle={isUserInviter() ? "If you want you can unsend your invitation" : "If you want to chat with this user click accept"} 
                        />
                    </div>
                }
                <MessageList
                    chat={chat} 
                    scroll={scrollElement} 
                />
            </MessagesWrapper>
            {chat.isAccepted ? 
                <Input
                    operation={operation}
                    setDefaultOperation={setDefaultOperation}
                    chat={chat}
                    type={0}
                />
            :
                isUserInviter() ?
                    <div 
                        className={styles.inputPlaceholder}
                        onClick={() => DirectsController.DeleteDirect(isUserInviter() ? chat.accountId : chat.ownerId)}
                    >
                        <button className={styles.reject}>Unsend</button>
                    </div>
                :
                    <div className={styles.inputPlaceholder}>
                        <button 
                            className={styles.accept}
                            onClick={() => DirectsController.AcceptDirect(chat.id)}
                        >
                            Accept
                        </button>
                        <button 
                            className={styles.reject}
                            onClick={() => DirectsController.DeleteDirect(isUserInviter() ? chat.accountId : chat.ownerId)}
                        >
                            Reject
                        </button>
                    </div>
            }
        </>
    );
});

export default Direct;