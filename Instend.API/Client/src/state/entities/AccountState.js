import { makeAutoObservable } from "mobx";

class AccountState {
    isAccessibleRoute = false;
    countNotifications = 0;
    friends = [];
    publications = [];
    isAuthorize = false;
    isLoading = true;
    account = null;
    publicationQueueId = 0;

    constructor() {
        makeAutoObservable(this);
    };

    Logout = () => {
        this.account = null;
        this.friends = [];
        this.publications = [];
        this.isAuthorize = false;
        this.publicationQueueId = 0;
        this.countNotifications = 0;
        this.isAccessibleRoute = false;

        localStorage.setItem('system_access_token', undefined);
        localStorage.setItem('system_refresh_token', undefined);
    };

    SetUser = (user) => this.account = user;
    DeletePublication = (id) => this.publications = this.publications.filter(element => element.comment.id !== id);
    RemoveCommunity = (community) => this.communities = this.communities.filter(element => element.id !== community.id);
    FindFriendById = (fiendId) => this.friends.find((f) => f.userId === fiendId || f.ownerId === fiendId);
    SetPublications = (publications) => this.publications = publications;
    SetPublicationQueueId = (id) => this.publicationQueueId = id;
    FindCommunityById = (id) => this.communities.find(c => c.id === id);
    SetLoadingState = (state) => this.isLoading = state;

    AddPublication = (comment, queueId) => {
        if (!!comment === false)
            return false;

        this.publications = this.publications.map(element => {
            if (element.queueId === queueId) {
                element = comment;
            }

            return element;
        });
    };

    GetUserOnSuccessCallback = (data) => {
        this.account = data;
        this.isAuthorize = true;
        this.isLoading = false;
    };

    GetUserOnFailureCallback = () => {
        this.isAuthorize = false;
        this.isLoading = false;
    };

    ChangeOccupiedSpace(occupiedSpace) {
        if (!this.account) 
            return false;
        
        this.account.occupiedSpace = occupiedSpace;
    };

    ChangeFollowingState = (accountId) => {
        if (!!this.account === false) {
            return false;
        };

        const originalLength = this.account.following.length; 

        this.account.following = this.account.following
            .filter(a => a.accountId !== accountId); 
        
        if (originalLength === this.account.following.length) {
            this.account.following = [...this.account.following, {accountId: accountId}];
        };
    };

    IsAccountInTheListOfFollowingAcounts = (accountId) => {
        if (this.account && this.account.following) {
            return !!this.GetFollowerById(accountId);
        };

        return false;
    };

    GetFollowerById = (accountId) => {
        return this.account.following
            .find(a => a.accountId === accountId);
    };
};

export default new AccountState();