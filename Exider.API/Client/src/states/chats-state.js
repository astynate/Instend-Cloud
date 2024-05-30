import { makeAutoObservable } from "mobx";

class ChatsState {
    chats = [];
    users = [];
    draft = null;
    connected = false;
    isChatsLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    SetChats = (chats) => {
        if (chats.directs && chats.directs.length && chats.directs.length > 0) {
            this.chats = chats.directs.map(element => {
                if (element.directModel && element.messageModel && element.userPublic) {
                    const chat = {
                        type: 'direct',
                        id: element.userPublic.id,
                        name: element.userPublic.nickname,
                        messages: [element.messageModel],
                        avatar: element.userPublic.avatar,
                        hasMore: true
                    }

                    this.users = [element.userPublic, ...this.users];
                    return chat;
                }

                return null;
            });
        }
    }

    setChatsLoadedState = (state) => {
        this.isChatsLoaded = state;
    }

    AddChatInQueue = (chat, type) => {
        chat.type = type;
        this.chats = [chat, ...this.chats];
    }

    setDraft = (user) => {
        user.type = 'draft';
        this.draft = user;
    }
    
    SetConnectedState = (state) => {
        this.connected = state;
    }
}

export default new ChatsState();