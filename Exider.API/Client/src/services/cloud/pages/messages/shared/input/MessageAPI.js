import { instance } from "../../../../../../state/Interceptors";
import chatsState from "../../../../../../states/chats-state";
import ChatHandler from "../../../../../../utils/handlers/ChatHandler";
import ChatTypes from "../../widgets/chat/ChatTypes";

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
        chatsState.SetLoadingMessage(chatsState.draft, message, attachments);
        form.append('id', chatsState.draft.id);
    }

    if (!chatsState.draft) {
        form.append('id', chat.id);
        form.append('queueId', chatsState
            .SetLoadingMessage(chat, message, attachments));
    }

    for (let i = 0; i < attachments.length; i++){
        form.append('attachments', attachments[i]);
    }

    form.append('type', type);
    form.append('text', message);
    form.append('replyTo', replyTo);

    await instance.post('api/message', form);
}