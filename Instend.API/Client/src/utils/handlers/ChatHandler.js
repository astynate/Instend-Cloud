import ChatTypes from "../../services/cloud/pages/messages/widgets/chat/helpers/ChatTypes";
import AccountState from "../../state/entities/AccountState";
import ChatsState from "../../state/entities/ChatsState";
import { SpecialTypes } from "./SpecialType";

class ChatHandler {
    static GetMessageUser = (message) => {
        if (!message || message && !message.userId) {
            return {};
        }

        if (message.userId === AccountState.account.id) {
            return AccountState.account;
        }

        const user = ChatsState.users
            .find(x => x.id === message.userId);

        if (!user) {
            return {};
        }

        return user;
    }

    static GetChatId = (chat) => {
        return chat.directId ? chat.directId : chat.id;
    }

    static GetChat(id) {
        if (!id) return null;

        return ChatsState.chats
            .find(x => x && (x.directId === id || x.id === id || x.Id === id));
    }

    static GetChatHandlerByType = (chat) => {
        let result = ChatTypes.notSelect;

        if (chat && chat.type) {
            return Object
                .values(ChatTypes)
                .find(element => {
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
        let result = ChatTypes.notSelect;

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

    static AdaptDirect = (directModel, messageModel, userPublic) => {
        const chat = {
            type: 'direct',
            id: userPublic.id,
            name: userPublic.nickname,
            messages: [messageModel],
            avatar: userPublic.avatar,
            directId: directModel.id,
            isAccepted: directModel.isAccepted,
            ownerId: directModel.ownerId,
            hasMore: true
        }

        return chat;
    }

    static AdaptGroup = (groupModel, messageModel) => {
        if (!messageModel) {
            messageModel = {
                specialType: SpecialTypes.Alert,
                text: 'Chat has beeen created.',
                date: groupModel.date
            };
        }

        const chat = {
            type: 'group',
            id: groupModel.id,
            name: groupModel.name,
            messages: [messageModel],
            ownerId: groupModel.ownerId,
            avatar: groupModel.avatar,
            members: groupModel.members,
            hasMore: true
        }

        return chat;
    }
}

export default ChatHandler;