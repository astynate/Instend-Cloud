import { observer } from "mobx-react-lite";
import ChatHeader from "../components/chat-header/ChatHeader";
import MessageList from "../../../../../features/lists/message-list/MessageList";
import Input from "../../../shared/input/Input";
import ChatsHelper from "../../chats/ChatsHelper";
import MessagesWrapper from "../../../../../features/wrappers/messages-wrapper/MessagesWrapper";

const Group = observer(({setRightPanelOpenState = () => {}, chat, operation, setDefaultOperation, scrollElement}) => {
    const data = ChatsHelper.GetChatData(chat);
    
    if (!chat) {
        return null;
    };
    
    return (
        <>
            <ChatHeader
                avatar={data.avatar}
                title={data.name}
                setRightPanelOpenState={setRightPanelOpenState}
                subTitle={`${data.numberOfMembers} members`}
            />
            <MessagesWrapper>
                <MessageList
                    chat={chat} 
                    scroll={scrollElement} 
                />
            </MessagesWrapper>
            <Input
                operation={operation}
                setDefaultOperation={setDefaultOperation}
                chat={chat}
                type={1}
            />
        </>
    );
});

export default Group;