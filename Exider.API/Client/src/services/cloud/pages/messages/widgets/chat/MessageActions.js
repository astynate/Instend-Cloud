import { instance } from "../../../../../../state/Interceptors";
import { messageWSContext } from "../../../../layout/Layout";

export const ChangeAccessStateAsync = async (id, isAccept) => {
    try {
        while (messageWSContext.connection.state !== 'Connected') {
            if (messageWSContext.connection.state === 'Disconnected') {
                await messageWSContext.connection.start();
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await messageWSContext.connection.invoke("ChangeAccessState", id, localStorage.getItem("system_access_token"), isAccept);
    } catch (error) {
        console.error('Failed to connect or join:', error);
    }
};

export const CopyMessageText = (items) => {
    let text = "";

    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].Text) {
                text += items[i].Text;
            }
        }
    }

    navigator.clipboard.writeText(text)
        .catch(err => {
            console.log('Something went wrong', err);
        });
}

export const DeleteMessages = async (items) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            await instance
                .delete(`/api/message?id=${items[i].id}`);
        }
    }
}

export const ChangePinnedState = async (items, id) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (id) {
                await instance.put(`/api/message?chatId=${id}&messageId=${items[i].id}&state=${!items[i].IsPinned}`);
            }
        }
    }
}