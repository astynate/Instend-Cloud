import { makeAutoObservable } from "mobx";

class AccountState {
    isAccessibleRoute = false;
    countNotifications = 0;
    friends = [];
    communities = [];
    publications = [];
    isAuthorize = false;
    isLoading = true;
    account = null;
    publicationQueueId = 0;

    constructor() {
        makeAutoObservable(this);
    }

    Logout = () => {
        this.account = null;
        this.friends = [];
        this.communities = [];
        this.publications = [];
        this.isAuthorize = false;
        this.publicationQueueId = 0;
        this.countNotifications = 0;
        this.isAccessibleRoute = false;

        localStorage.setItem('system_access_token', undefined);
        localStorage.setItem('system_refresh_token', undefined);
    }

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
    }

    GetUserOnSuccessCallback = (data) => {
        this.account = data[0];
        this.friends = data[1];
        this.isAuthorize = true;
        this.isLoading = false;
    }

    GetUserOnFailureCallback = () => {
        this.isAuthorize = false;
        this.isLoading = false;
    }

    ChangeOccupiedSpace(occupiedSpace) {
        if (!this.account) 
            return false;
        
        this.account.occupiedSpace = occupiedSpace;
    }

    IsUserInFriends = (userId) => {
        const user = this.friends.find(user => 
            (user.userId === userId || user.ownerId === userId));

        return user != null;
    }
}

export default new AccountState();