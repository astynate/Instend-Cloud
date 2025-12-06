import { observer } from "mobx-react-lite";
import { GetMessageDateIfItNessecery, GetMessagePosition } from '../../../pages/messages/widgets/chat/helpers/MessageActions';
import styles from './main.module.css';
import Message from '../../../pages/messages/shared/message/Message';
import AccountState from '../../../../../state/entities/AccountState';
import MessangerController from '../../../api/MessangerController';
import ChatsState from '../../../../../state/entities/ChatsState';
import FetchItemsWithPlaceholder from '../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';
import { useState } from "react";

const MessageList = observer(({chat, scroll}) => {
    const { account } = AccountState;
    const [isHasMore, setHasMoreState] = useState(true);

    useState(() => {
        console.log(isHasMore)
        setHasMoreState(true);
    }, [chat.id]);

    return (
        <div className={styles.messages}>
            <FetchItemsWithPlaceholder
                item={<div></div>}
                isHasMore={isHasMore}
                callback={async () => {
                    await MessangerController.GetMessages(
                        chat.id, 
                        chat,
                        setHasMoreState,
                        ChatsState.addUniqueMessages
                    );
                }}
            />
            {chat.messages && chat.messages
                .map((message, index) => {
                    const position = GetMessagePosition(message, chat, index);
                    const date = GetMessageDateIfItNessecery(message, chat, index);
                    const isCurrentAccountMessage = message.accountId === account.id;

                    return (
                        <div key={message.id ?? index} data={message.id}>
                            {date && <div className={styles.date}>
                                <span>{date}</span>
                            </div>}
                            <Message
                                position={position}
                                message={message} 
                                isCurrentAccountMessage={isCurrentAccountMessage}
                            /> 
                        </div>
                    );
                })}
        </div>
    );
});

export default MessageList;