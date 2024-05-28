import { makeAutoObservable } from "mobx";

class ChatsState {
    chats = []
    draft = null
    currentChatIndex = -1;

    constructor() {
        makeAutoObservable(this);
    }

    AddChatInQueue = (chat, type) => {
        chat.type = type;
        this.chats = [chat, ...this.chats];
    }

    setDraft = (user) => {
        user.type = 'draft';
        this.draft = user;
    }
}

export default new ChatsState();