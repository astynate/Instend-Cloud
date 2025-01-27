import GlobalContext from "../../../global/GlobalContext";
import { instance } from "../../../state/application/Interceptors";
import ChatsState from "../../../state/entities/ChatsState";

class MessangerController {
    static CreateGroup = async () => {
    };

    static SendMessage = async (chat, text, attachments) => {
        const form = new FormData();
        const type = chat.type.type === 2 ? 0 : 1;

        const message = {
            id: GlobalContext.NewGuid(),

        };

        const queueId = ChatsState.SetLoadingMessage(
            chat,
            message,
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
};

export default MessangerController;