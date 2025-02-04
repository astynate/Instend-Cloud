import { makeAutoObservable } from "mobx";
import AccountState from "./AccountState";
import ChatHandler from "../../utils/handlers/ChatHandler";
import GlobalContext from "../../global/GlobalContext";
import ChatTypes from "../../services/cloud/pages/messages/widgets/chat/helpers/ChatTypes";
import SortingHandler from "../../utils/handlers/SortingHandler";
import { SpecialTypes } from "../../utils/handlers/SpecialType";
import StorageController from "../../api/StorageController";

class ChatsState {
    chats = [];
    users = [];
    draft = null;
    connected = false;
    messageQueueId = 1;
    numberOfLoadedDirects = 0;
    numberOfLoadedGroups = 0;
    isHasMoreDirects = true;
    isHasMoreGroups = true;
    isBusy = false;

    constructor() {
        makeAutoObservable(this);
    }

    increaseNumberOfLoadedDirects = (value) => {
        this.numberOfLoadedDirects += value;
    };

    increaseNumberOfLoadedGroups = (value) => {
        this.numberOfLoadedGroups += value;
    };

    IsDraftWithTargetUser = (chat) => {
        const accountId = chat.ownerId === AccountState.account.id ? chat.accountId : chat.ownerId;
        return this.draft && this.draft.id === accountId;
    };

    setHasMoreDirects = (state) => {
        this.isHasMoreDirects = !!state;
    };

    setHasMoreGroups = (state) => {
        this.isHasMoreGroups = !!state;
    };

    addChat = (chat) => {
        if (!chat.messages || chat.messages.length === 0) {
            const message = {
                id: GlobalContext.NewGuid(),
                specialType: SpecialTypes.Alert,
                date: chat.date,
                text: 'Chat has been created'
            };

            chat.messages = [message];
        };

        chat.isHasMore = true;

        this.chats = [...this.chats, chat]
            .sort((a, b) => SortingHandler.CompareTwoDates(a.date, b.date, true));
    };

    AddChatInQueue = (chat, type) => {
        chat.type = type;
        this.chats = [chat, ...this.chats];
    };

    GetChatById = (id) => {
        const result = this.chats
            .find(chat => chat.id === id);

        return result;
    };

    setDraft = (account) => {
        if (!account|| !AccountState.account || !AccountState.account.id) {
            this.draft = null;
            return true;
        };

        const isChatExist = this.chats.map(chat => chat.id).includes(account.id);
        const isSelftMessage = AccountState.account.id === account.id;
        
        if (isChatExist === true || isSelftMessage === true) {
            return false;
        };

        account.type = ChatTypes.draft;
        account.messages = [];
        account.avatar = StorageController.getFullFileURL(account.avatar);

        this.draft = account;
        
        return true;
    };
    
    SetConnectedState = (state) => {
        this.connected = state;

        if (state === false) {
            this.chats = [];
        }
    };

    AcceptDirect = (id) => {
        let chat = this.GetChatById(id);
        chat.isAccepted = true;
    };

    SetLoadingMessage = (chat, text, attachments) => {
        const queueId = this.messageQueueId;

        if (!!chat === false) {
            return queueId;
        }

        const messageValue = {
            date: new Date(),
            id: undefined,
            text: text,
            sender: AccountState.account,
            accountId: AccountState.account.id,
            attachments: attachments,
            queueId: queueId,
            isViewed: false
        };

        this.messageQueueId++;
        chat.messages = [...chat.messages, messageValue];

        return queueId;
    };

    AddMessage = (transferModel, queueId) => {
        let chat = this.GetChatById(transferModel.id);

        if (!chat) {
            this.chats = [...this.chats, transferModel];
            return;
        };

        chat.messages = chat.messages
            .filter(m => m.queueId !== queueId);

        this.addUniqueMessages(transferModel, false);
    };

    addUniqueMessages = async (chat, isSetHasMore = true) => {
        let target = this.GetChatById(chat.id);
    
        let existingMessageIds = new Set(target.messages.map(message => message.id));
        let newMessages = chat.messages.filter(message => !existingMessageIds.has(message.id));
    
        target.isHasMore = isSetHasMore ? newMessages.length >= 5 : target.isHasMore;
        target.messages = [...newMessages, ...target.messages].sort((a, b) => SortingHandler.CompareTwoDates(a.date, b.date, false));
    };   

    ViewMessage = (id, chatId) => {
        const chat = ChatHandler.GetChat(chatId);

        if (chat && chat.messages) {
            let message = chat.messages.find(element => element.id === id);
            if (message) message.isViewed = true;
        }
    };

    SetDraftMessage = (message) => {
        if (this.draft && this.draft.id) {        
            this.draft.messages = [message];
        }
    };

    DeleteChat = (id) => {
        this.chats = this.chats.filter(x => x.id !== id);
    };

    DeleteMessage = (messageId, chatId) => {
        const chat = this.chats
            .find(element => element.directId === chatId);

        if (chat && chat.messages) {
            chat.messages = chat.messages
                .filter(element => element.id !== messageId);
        }
    };

    addGroupMember = (id, user) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = [...chat.members, user];
        }
    };

    removeGroupMember = (id, userId) => {
        const chat = ChatHandler.GetChat(id);

        if (chat && chat.members) {
            chat.members = chat.members
                .filter(e => e.id !== userId && e.Id !== userId);
        }
    };
};

export default new ChatsState();