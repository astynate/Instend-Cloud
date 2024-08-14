import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";
import userState from "./user-state";
import { DateTime } from "luxon";

class ChatsState {
    chats = [];
    users = [];
    draft = null;
    connected = false;
    messageQueueId = 1;
    isChatsLoaded = false;
    isBusy = false;

    constructor() {
        makeAutoObservable(this);
    }

    SetChats = (chats) => {
        chats = JSON.parse(chats);

        if (chats.directs && chats.directs.length && chats.directs.length >= 0) {
            this.chats = chats.directs
                .map(element => {
                    if (element.directModel && element.messageModel && element.userPublic) {
                        element.messageModel.id = element.messageModel.Id;

                        const chat = {
                            type: 'direct',
                            id: element.userPublic.Id,
                            hasMore: true,
                            name: element.userPublic.Nickname,
                            directId: element.directModel.Id,
                            messages: [element.messageModel],
                            isAccepted: element.directModel.IsAccepted,
                            ownerId: element.directModel.OwnerId,
                            avatar: element.userPublic.Avatar,
                        }

                        if (this.users.map(u => u.Id).includes(element.userPublic.Id) === false) {
                            this.users = [element.userPublic, ...this.users];
                        }

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
        if (user && userState.user && userState.user.id) {
            if (this.chats.map(chat => chat.id).includes(user.id) || userState.user.id === user.id) {
                return false;
            } else {
                user.type = 'draft';
                this.draft = user;
            }
        } else {
            this.draft = null;
        }

        return true;
    }
    
    SetConnectedState = (state) => {
        this.connected = state;
    }

    UpdateDirectAccessState = (id, state) => {
        if (state === false) {
            this.chats = this.chats.filter(element => {
                if (element.directId && element.directId === id) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            this.chats.map(element => {
                if (element.directId && element.directId === id) {

                    element.isAccepted = true;
                }
            });
        }
    }

    SetLoadingMessage = (directId, message, attachments) => {
        const chat = this.chats.find(element => element.directId === directId);
        const queueId = this.messageQueueId;

        if (chat !== null && chat !== undefined) {
            const messageValue = {
                Date: new Date(),
                Id: undefined,
                IsPinned: false,
                Text: message,
                UserId: userState.user.id,
                attachments: attachments,
                queueId: queueId,
                id: undefined,
                isViewed: false
            };

            this.messageQueueId++;
            chat.messages = [...chat.messages, messageValue];
        }

        return queueId;
    }

    AddMessage(direct, message, userPublic, queueId) {
        message.id = message.Id;
        
        if (this.chats.map(element => element.directId).includes(direct.Id) === false) {
            const chat = {
                type: 'direct',
                id: userPublic.Id,
                name: userPublic.Nickname,
                messages: [message],
                avatar: userPublic.Avatar,
                directId: direct.Id,
                isAccepted: direct.IsAccepted,
                ownerId: direct.OwnerId,
                hasMore: true
            }

            this.chats = [chat, ...this.chats];
        } else {
            const chat = this.chats.find(element => element.directId === direct.Id);

            if (chat) {
                if (userPublic.Id === userState.user.id) {
                    chat.messages = chat.messages.filter(e => e.queueId !== queueId);
                }

                chat.messages = [...chat.messages, message];
            }
        }

        if (this.users.map(u => u.Id).includes(userPublic.Id) === false) {
            this.users = [userPublic, ...this.users];
        }
    }

    GetMessages = async (chatId) => {
        if (this.isBusy === true) {
            return;
        }

        const chat = this.chats.find(element => element.id === chatId);

        if (chat && chat.hasMore === true && chat.messages) {
            this.isBusy = true;

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
                            element.id = element.Id;
                            chat.messages = [element, ...chat.messages];
                        });
                    }

                    this.isBusy = false;
                });
        }
    }

    ViewMessage = (id, chatId) => {
        const chat = this.chats
            .find(element => element.id === chatId || element.directId === chatId);

        if (chat && chat.messages) {
            let message = chat.messages
                .find(element => element.id === id || element.Id === id);

            if (message) { message.IsViewed = true; }
        }
    }

    SetDraftMessage = (message) => {
        if (this.draft && this.draft.id) {        
            this.draft.messages = [message];
        }
    }

    DeleteChat = (id) => {
        this.chats = this.chats
            .filter(element => element.directId !== id);
    }

    DeleteMessage = (messageId, chatId) => {
        const chat = this.chats
            .find(element => element.directId === chatId);

        if (chat && chat.messages) {
            chat.messages = chat.messages
                .filter(element => element.id !== messageId);
        }
    }

    UpdateMessagePinnedState = (chatId, messageId, state) => {
        const chat = this.chats
        .find(element => element.directId === chatId);

        if (chat && chat.messages) {
            let message = chat.messages.find(element => element.id === messageId);

            if (message) {
                message.IsPinned = state;
            }
        }   
    }
}

export default new ChatsState();