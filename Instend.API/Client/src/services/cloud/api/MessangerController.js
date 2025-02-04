import { instance } from "../../../state/application/Interceptors";
import ChatsState from "../../../state/entities/ChatsState";

class MessangerController {
    static SendMessage = async (chat, text, type, attachments) => {
        const form = new FormData();

        const queueId = ChatsState.SetLoadingMessage(
            chat,
            text,
            attachments
        );

        form.append('id', chat.id);
        form.append('text', text);
        form.append('type', type);
        form.append('queueId', queueId);
        
        await instance
            .post('api/messages', form)
            .catch(error => {
                console.error(error);
            });
    };

    static GetMessages = async (id, chat, onSuccess = () => {}) => {
        if (!chat.messages || chat.messages.length < 1) {
            return false;
        };

        const lastMessage = chat.messages[0];
        const endpoint = chat.type + "s";

        await instance
            .get(`/api/${endpoint}?id=${id}&date=${lastMessage.date}`)
            .then(response => {
                if (response && response.data) {
                    onSuccess(response.data);
                };
            })
            .catch(error => {
                console.error(error);
            });
    };

    static deleteMessage = async (id) => {
        await instance.delete(`/api/messsages?id=${id}`);
    };
};

export default MessangerController;