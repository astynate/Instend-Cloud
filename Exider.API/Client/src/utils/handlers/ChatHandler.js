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
}

export default ChatHandler;