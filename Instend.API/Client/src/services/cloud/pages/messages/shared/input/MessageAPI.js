import { instance } from "../../../../../../state/Interceptors";
import chatsState from "../../../../../../states/chats-state";

const AppendArray = (name, form, array) => {
    for (let i = 0; i < array.length; i++){
        form.append(name, array[i]);
    }
}

export const SendMessage = async (
        message, 
        attachments, 
        replyTo, 
        chat, 
        type = 0,
        selectedFiles,
        selectedFolders
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

        form.append('queueId', chatsState.SetLoadingMessage(
            chat, 
            message, 
            attachments
        ));
    }

    AppendArray('attachments', form, attachments);
    AppendArray('fileIds', form, selectedFiles);
    AppendArray('folderIds', form, selectedFolders);

    form.append('type', type);
    form.append('text', message);
    form.append('replyTo', replyTo);

    await instance.post('api/message', form);
}