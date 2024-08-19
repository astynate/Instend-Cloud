import Input from "../../../shared/input/Input";
import MessangerHeader from "../components/Header/MessangerHeader";
import MessageList from "../components/MessageList/MessageList";

const Group = ({operation, setDefaultOperation, chat, scrollElement}) => {
    return (
        <>
            <MessangerHeader
                avatar={chat.avatar}
                title={chat.name}
                subTitle={`${chat.members ? chat.members.length : 0} members`}
            />
            <MessageList 
                chat={chat} 
                scroll={scrollElement} 
            />
            <Input
                operation={operation}
                setDefaultOperation={setDefaultOperation}
                chat={chat}
            />
        </>
    );
}

export default Group;