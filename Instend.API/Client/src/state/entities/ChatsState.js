import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";
import userState from "./UserState";
import ChatHandler from "../../utils/handlers/ChatHandler";
import ChatTypes from "../../services/cloud/pages/messages/widgets/chat/ChatTypes";

class ChatsState {
    chats = [];
    users = [];
    draft = null;
    connected = false;
    messageQueueId = 1;
    isChatsLoaded = false;
    countLoadedChats = 0;
    isBusy = false;

    constructor() {
        makeAutoObservable(this);
    }

    SetChats = (chatsValue) => {
        chatsValue = JSON.parse(chatsValue);

        const isDirectsConnected = chatsValue.directs.length === 0;
        const isGroupsConnected = chatsValue.groups.length === 0;

        this.connected = isDirectsConnected && isGroupsConnected;
        this.countLoadedChats++;

        if (chatsValue.directs.length >= 0) {
            this.chats = [...chatsValue.directs
                .map(element => {
                    if (element.model && element.messageModel && element.userPublic) {
                        const chat = ChatHandler.AdaptDirect(element.model, element.messageModel, element.userPublic);

                        if (this.users.map(u => u.id).includes(element.userPublic.id) === false) {
                            this.users = [element.userPublic, ...this.users];
                        }

                        return chat;
                    }

                    return null;
                })
                .filter(e => e), ...this.chats];
        }

        if (chatsValue.groups.length >= 0) {
            this.chats = [...chatsValue.groups
                .map(element => {
                    if (element.model) {
                        const chat = ChatHandler.AdaptGroup(element.model, element.messageModel);

                        for (let index in element.model.members) {
                            if (!element.model.members[index]) {
                                continue;
                            }

                            if (this.users.map(u => u.id).includes(element.model.members[index].id) === false) {
                                this.users = [element.model.members[index], ...this.users];
                            }
                        }

                        return chat;
                    }
                })
                .filter(e => e), ...this.chats];
        }

        const uniqueIds = new Set();

        this.chats = this.chats.filter(chat => {
            if (uniqueIds.has(chat.id)) {
                return false;
            }
            uniqueIds.add(chat.id);
            return true; 
        });
    }

    addGroup = (groupModel, messageModel=null) => {
        this.chats = [...this.chats, ChatTypes.group.adapt(groupModel, messageModel)];
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
            }

            user.type = 'draft';
            user.messages = [];

            this.draft = user;
            return true;
        }

        this.draft = null;
        return true;
    }
    
    SetConnectedState = (state) => {
        this.connected = state;

        if (state === false) {
            this.chats = [];
        }
    }

    UpdateDirectAccessState = (id, state) => {
        if (state === false) {
            this.chats = this.chats.filter(element => {
                return !(element.directId && element.directId === id);
            });
        } else {
            this.chats.map(element => {
                if (element.directId && element.directId === id) {
                    element.isAccepted = true;
                }
            });
        }
    }

    SetLoadingMessage = (chat, message, attachments) => {
        const queueId = this.messageQueueId;

        if (chat !== null && chat !== undefined) {
            const messageValue = {
                date: new Date(),
                id: undefined,
                text: message,
                userId: userState.user.id,
                attachments: attachments,
                queueId: queueId,
                isViewed: false
            };

            this.messageQueueId++;
            chat.messages = [...chat.messages, messageValue];
        }

        return queueId;
    }

    AddMessage(chat, message, userPublic, queueId) {
        switch (chat.type) {
            case (ChatTypes.direct.prefix): {
                chat = ChatHandler.AdaptDirect(chat, message, userPublic);
                break;
            }
            case (ChatTypes.group.prefix): {
                chat = ChatHandler.AdaptGroup(chat, message);
                break;
            }
        }

        if (this.chats.map(e => e.directId ?? e.id).includes(chat.directId ?? chat.id) === false) {
            this.chats = [chat, ...this.chats];
        } 
        else {
            const chatValue = ChatHandler.GetChat(chat.directId ?? chat.id);

            if (chatValue) {
                if (message.userId === userState.user.id) {
                    chatValue.messages = chatValue.messages.filter(e => e.queueId !== queueId);
                }

                chatValue.messages = [...chatValue.messages, message];
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

        const chat = ChatHandler.GetChat(chatId);

        if (chat && chat.hasMore === true && chat.messages) {
            this.isBusy = true;

            await instance
                .get(`/api/${chat.type}s?destination=${chatId}&from=${chat.messages.length}&count=${20}`)
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

                    this.isBusy = false;
                });
        }
    }

    ViewMessage = (id, chatId) => {
        const chat = ChatHandler.GetChat(chatId);

        if (chat && chat.messages) {
            let message = chat.messages.find(element => element.id === id);
            if (message) message.isViewed = true;
        }
    }

    SetDraftMessage = (message) => {
        if (this.draft && this.draft.id) {        
            this.draft.messages = [message];
        }
    }

    DeleteChat = (id, user) => {
        if (user === userState.user.id) {
            this.chats = this.chats
                .filter(element => element.directId !== id && element.id !== id);
        } else {
            const chat = ChatHandler.GetChat(id);

            if (chat && chat.members) {
                chat.members = chat.members
                    .filter(u => u.id !== user && u.Id !== user);
            }
        }
    }

    DeleteMessage = (messageId, chatId) => {
        const chat = this.chats
            .find(element => element.directId === chatId);

        if (chat && chat.messages) {
            chat.messages = chat.messages
                .filter(element => element.id !== messageId);
        }
    }

    addGroupMember = (id, user) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = [...chat.members, user];
        }
    }

    removeGroupMember = (id, userId) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = chat.members
                .filter(e => e.id !== userId && e.Id !== userId);
        }
    }
}

export default new ChatsState();