import { instance } from "../../../../../../../state/application/Interceptors";
import { ConvertDate, IsDayDiffrent } from "../../../../../../../handlers/DateHandler";
import { globalWSContext } from "../../../../../layout/Layout";

export const ChangeAccessStateAsync = async (id, isAccept) => {
    try {
        while (globalWSContext.connection.state !== 'Connected') {
            if (globalWSContext.connection.state === 'Disconnected') {
                await globalWSContext.connection.start();
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await globalWSContext.connection.invoke("ChangeAccessState", id, localStorage.getItem("system_access_token"), isAccept);
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
};

export const DeleteMessages = async (items) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            await instance
                .delete(`/api/message?id=${items[i].id}`);
        }
    }
};

export const ChangePinnedState = async (items, id) => {
    if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (id) {
                await instance.put(`/api/message?chatId=${id}&messageId=${items[i].id}&state=${!items[i].IsPinned}`);
            }
        }
    }
};

const IsDateExist = (elements) => {
    for (let index in elements) {
        if (!elements[index] || !elements[index].date) {
            return false;
        }
    }
    
    return true;
};

export const GetMessagePosition = (current, chat, index) => {
    let position = 3;

    const previous = chat.messages[index - 1];
    const next = chat.messages[index + 1];

    const isMiddleMessage = previous && next && previous.accountId === current.accountId && next.accountId === current.accountId;
    const isLastMessage = previous && previous.accountId === current.accountId;
    const isFirstMessage = next && next.accountId === current.accountId;

    if (isMiddleMessage) {
        if (IsDateExist([next, current]) && IsDayDiffrent(next.date, current.date)) {
            position = 2;
        } else {
            if (IsDateExist([previous, current]) && IsDayDiffrent(previous.date, current.date)) {
                position = 0;
            } else {
                position = 1;
            }
        }
    } else if (isLastMessage) {
        if (IsDateExist([previous, current]) && IsDayDiffrent(previous.date, current.date)) {
            position = 3;
        } else {
            position = 2;
        }
    } else if (isFirstMessage) {
        if (IsDateExist([next, current]) && IsDayDiffrent(next.date, current.date)) {
            position = 3;
        } else {
            position = 0;
        }
    }

    return position;
};

export const GetMessageDateIfItNessecery = (current, chat, index) => {
    let date = null;
    const previous = chat.messages[index - 1];

    if (previous && previous.date && current && current.date) {
        date = IsDayDiffrent(previous.date, current.date) === true ? ConvertDate(current.date) : null;
    } else if (current && current.date) {
        date = ConvertDate(current.date);
    }

    return date;
};