import { instance } from "../../../../../../state/Interceptors";
import { ConvertDate, IsDayDiffrent } from "../../../../../../utils/DateHandler";
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

const IsDateExist = (elements) => {
    for (let index in elements) {
        if (!elements[index] || !elements[index].Date) {
            return false;
        }
    }
    
    return true;
}

export const GetMessagePosition = (current, chat, index) => {
    let position = 3;

    const previous = chat.messages[index - 1];
    const next = chat.messages[index + 1];

    const isMiddleMessage = previous && next && previous.UserId === current.UserId && next.UserId === current.UserId;
    const isLastMessage = previous && previous.UserId === current.UserId;
    const isFirstMessage = next && next.UserId === current.UserId;

    if (isMiddleMessage) {
        if (IsDateExist([next, current]) && IsDayDiffrent(next.Date, current.Date)) {
            position = 2;
        } else {
            if (IsDateExist([previous, current]) && IsDayDiffrent(previous.Date, current.Date)) {
                position = 0;
            } else {
                position = 1;
            }
        }
    } else if (isLastMessage) {
        if (IsDateExist([previous, current]) && IsDayDiffrent(previous.Date, current.Date)) {
            position = 3;
        } else {
            position = 2;
        }
    } else if (isFirstMessage) {
        if (IsDateExist([next, current]) && IsDayDiffrent(next.Date, current.Date)) {
            position = 3;
        } else {
            position = 0;
        }
    }

    return position;
}

export const GetMessageDateIfItNessecery = (current, chat, index) => {
    let date = null;
    const previous = chat.messages[index - 1];

    if (previous && previous.Date && current && current.Date) {
        date = IsDayDiffrent(previous.Date, current.Date) === true ? ConvertDate(current.Date) : null;
    } else if (current && current.Date) {
        date = ConvertDate(current.Date);
    }

    return date;
}