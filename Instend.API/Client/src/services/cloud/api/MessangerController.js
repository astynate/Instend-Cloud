import { instance } from "../../../state/application/Interceptors";
import ChatsState from "../../../state/entities/ChatsState";

class MessangerController {
    static AddArrayToFormData = (form, title, items) => {
        for (let i = 0; i < items.length; i++) {
            form.append(`${title}[${i}]`, items[i]);
        };
    };

    static SendMessage = async (chat, text, type, attachments = [], collections = [], files = []) => {
        const form = new FormData();
        
        const itemsToAttach = [
            // { name: 'attachments', items: attachments },
            { name: 'collections', items: collections.map(e => e.id) },
            { name: 'files', items: files.map(e => e.id) },
        ];

        const queueId = ChatsState.SetLoadingMessage(
            chat,
            text,
            attachments
        );

        for (let itemToAttach of itemsToAttach) {
            if (itemToAttach.items.length > 0) {
                MessangerController.AddArrayToFormData(
                    form,
                    itemToAttach.name, 
                    itemToAttach.items
                );
            };
        };

        for (let i = 0; i < attachments.length; i++) {
            form.append(`attachments`, attachments[i]);
        };

        form.append('id', chat.id);
        form.append('text', text);
        form.append('type', type);
        form.append('queueId', queueId);
        
        await instance
            .post('api/messages', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }}
            )
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