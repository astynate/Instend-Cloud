import { instance } from "../../../../../../state/Interceptors";
import chatsState from "../../../../../../states/chats-state";
import ChatHandler from "../../../../../../utils/handlers/ChatHandler";

export const SendMessage = async (
        message, 
        attachments, 
        replyTo, 
        chat, 
        type = 0
    ) => {

    if (message === '' || !message) { 
        return false; 
    }
    
    let form = new FormData();

    if (chatsState.draft) {
        form.append('id', chatsState.draft.id);
    } else {
        form.append('id', chat.id);
        form.append('queueId', chatsState.SetLoadingMessage(ChatHandler.GetChatId(chat), message, attachments));

        for (let i = 0; i < attachments.length; i++){
            form.append('attachments', attachments[i]);
        }
    }

    form.append('type', type);
    form.append('text', message);
    form.append('replyTo', replyTo);

    await instance.post('api/message', form);
}