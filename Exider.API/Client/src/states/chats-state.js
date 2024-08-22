import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";
import userState from "./user-state";
import { SpecialTypes } from "../utils/handlers/SpecialType";
import ChatHandler from "../utils/handlers/ChatHandler";

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

        try {
            if (chatsValue.directs.length >= 0) {
                this.chats = [...chatsValue.directs
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
                    .filter(element => element !== null), ...this.chats];
            }
    
            if (chatsValue.groups.length >= 0) {
                this.chats = [...chatsValue.groups
                    .map(element => {
                        if (element.groupModel) {
                            if (element.messageModel === null) {
                                element.messageModel = {
                                    SpecialType: SpecialTypes.Alert,
                                    Text: 'Chat has beeen created.',
                                    Date: element.groupModel.Date
                                };
                            }
    
                            const chat = {
                                type: 'group',
                                id: element.groupModel.Id,
                                hasMore: true,
                                name: element.groupModel.Name,
                                messages: [element.messageModel],
                                ownerId: element.groupModel.OwnerId,
                                avatar: element.groupModel.Avatar,
                                members: element.groupModel.Members.filter(x => x)
                            }
    
                            for (let index in element.groupModel.Members) {
                                if (!element.groupModel.Members[index]) {
                                    continue;
                                }
    
                                if (this.users.map(u => u.Id).includes(element.groupModel.Members[index].Id) === false) {
                                    this.users = [element.groupModel.Members[index], ...this.users];
                                }
                            }
    
                            return chat;
                        }
    
                        return null;
                    })
                    .filter(element => element !== null), ...this.chats];
            }
        } catch { 
            console.error('Someting went wrong!');
        }
    }

    addGroup = (groupModel) => {
        const messageModel = {
            SpecialType: SpecialTypes.Alert,
            Text: 'Chat has beeen created.',
            Date: groupModel.Date
        };

        const chat = {
            type: 'group',
            id: groupModel.Id,
            hasMore: false,
            name: groupModel.Name,
            messages: [messageModel],
            ownerId: groupModel.OwnerId,
            avatar: groupModel.Avatar,
            members: groupModel.Members
        }
        
        this.chats = [...this.chats, chat];
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

        if (state === false) {
            this.chats = [];
        }
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

    AddMessage(chat, message, userPublic, queueId) {
        message.id = message.Id;
        
        if (this.chats.map(element => element.directId ?? element.id).includes(chat.Id) === false) {
            const chat = {
                type: chat.type,
                id: userPublic.Id,
                name: userPublic.Nickname,
                messages: [message],
                avatar: userPublic.Avatar,
                directId: chat.Id,
                isAccepted: chat.IsAccepted,
                ownerId: chat.OwnerId,
                hasMore: true
            }

            this.chats = [chat, ...this.chats];
        } else {
            const chatValue = this.chats.find(element => element.directId === chat.Id);

            if (chatValue) {
                if (userPublic.Id === userState.user.id) {
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
            .filter(element => element.directId !== id && element.id !== id);
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

    addGroupMember = (id, user) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = [...chat.members, user];
        }
    }

    removeGroupMember = (id, userId) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = chat.members.filter(e => e.id !== userId && e.Id !== userId);
        }
    }
}

export default new ChatsState();