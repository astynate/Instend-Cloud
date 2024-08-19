import { observer } from "mobx-react-lite";
import Input from "../../../shared/input/Input";
import MessangerHeader from "../components/Header/MessangerHeader";
import MessageList from "../components/MessageList/MessageList";

const Direct = observer(({operation, setDefaultOperation, chat, scrollElement}) => {
    return (
        <>
            <MessangerHeader 
                avatar={chat.avatar}
                title={chat.name}
                subTitle={"last seen recently"}
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
});

export default Direct;