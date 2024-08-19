import ChatTypes from "../../services/cloud/pages/messages/widgets/chat/ChatTypes";
import chatsState from "../../states/chats-state"
import userState from "../../states/user-state";

class ChatHandler {
    static GetMessageUser = (message) => {
        if (!message || message && !message.UserId) {
            return {};
        }

        if (message.UserId === userState.user.id) {
            return userState.user;
        }

        const user = chatsState.users
            .find(x => x.Id === message.UserId);

        if (!user) {
            return {};
        }

        return user;
    }

    static GetChatId = (chat) => {
        return chat.directId ? chat.directId : chat.id;
    }

    static GetChat(id) {
        return chatsState.chats.find(x => x.directId === id || x.id === id || x.Id === id);
    }

    static GetChatHandlerByType = (chat) => {
        let result = ChatTypes.NotSelect

        if (chat && chat.type) {
            return Object.values(ChatTypes).find(element => {
                if (element && element.prefix) {
                    return chat.type === element.prefix;
                }
                return false;
            }) || result;
        }

        return result;
    }

    static GetChatType = (params) => {
        const regex = /#.*?-/g;
        let result = ChatTypes.NotSelect;

        if (params.id) {
            return Object.values(ChatTypes).find(element => {
                if (element && element.prefix) {
                    return params.id.match(regex) !== null;
                }
                return false;
            }) || result;
        }

        return result;
    }
}

export default ChatHandler;