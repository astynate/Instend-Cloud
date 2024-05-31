import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";

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
        chats = JSON.parse(chats);

        if (chats.directs && chats.directs.length && chats.directs.length > 0) {
            this.chats = chats.directs
                .map(element => {
                    if (element.directModel && element.messageModel && element.userPublic) {
                        const chat = {
                            type: 'direct',
                            id: element.userPublic.Id,
                            hasMore: true,
                            name: element.userPublic.Nickname,
                            directId: element.directModel.Id,
                            messages: [element.messageModel],
                            avatar: element.userPublic.Avatar,
                        }

                        this.users = [element.userPublic, ...this.users];
                        return chat;
                    }

                    return null;
                })
                .filter(element => element !== null);
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

    AddMessage(direct, message, userPublic) {
        if (this.chats.map(element => element.id).includes(userPublic.Id) === false) {
            const chat = {
                type: 'direct',
                id: userPublic.Id,
                name: userPublic.Nickname,
                messages: [message],
                avatar: userPublic.Avatar,
                directId: direct.Id,
                hasMore: true
            }

            this.chats = [chat, ...this.chats];
            this.chats[0].messages = [message, ...this.chats[0].messages];
        } else {
            const chat = this.chats.find(element => element.id === userPublic.Id);

            if (chat) {
                chat.messages = [...chat.messages, message];
            }
        }
    }

    GetMessages = async (chatId) => {
        const chat = this.chats.find(element => element.id === chatId);

        if (chat && chat.hasMore === true && chat.messages) {
            await instance
                .get(`/api/directs?destination=${chatId}&from=${chat.messages.length}&count=${20}`)
                .then(response => {
                    if (!response || !response.data) {
                        return;
                    } 

                    if (response.data.length === 0) {
                        chat.hasMore = false;
                    }

                    if (response.data.map && response.data.length > 0) {                    
                        response.data.map(element => {
                            chat.messages = [element, ...chat.messages];
                        });
                    }
                });
        }
    }
}

export default new ChatsState();