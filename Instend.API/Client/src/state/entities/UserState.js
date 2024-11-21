import { makeAutoObservable } from "mobx";

class UserState {
    isAccessibleRoute = false;
    countNotifications = 0;
    friends = [];
    communities = [];
    publications = [];
    isAuthorize = false;
    isLoading = true;
    user = null;
    publicationQueueId = 0;

    constructor() {
        makeAutoObservable(this);
    }

    Logout = () => {
        this.user = null;
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

    SetUser = (user) => this.user = user;
    DeletePublication = (id) => this.publications = this.publications.filter(element => element.comment.id !== id);
    RemoveCommunity = (community) => this.communities = this.communities.filter(element => element.id !== community.id);
    FindFriendById = (fiendId) => this.friends.find((f) => f.userId === fiendId || f.ownerId === fiendId);
    SetPublications = (publications) => this.publications = publications;
    SetPublicationQueueId = (id) => this.publicationQueueId = id;
    FindCommunityById = (id) => this.communities.find(c => c.id === id);
    SetLoadingState = (state) => this.isLoading = state;

    AddPublication = (comment, queueId) => {
        if (comment) {
            this.publications = this.publications.map(element => {
                if (element.queueId === queueId) {
                    element = comment;
                }

                return element;
            });
        }
    }

    GetUserOnSuccessCallback = (userData) => {
        this.user = userData[0];
        this.friends = userData[1];
        this.communities = userData[2];
        this.isAuthorize = true;
    }

    GetUserOnFailureCallback = () => {
        this.isAuthorize = false;
        this.isLoading = false;
    }

    UpdateAuthorizeState = async (location, navigate) => {
        // this.isLoading = true;
        // await this.UpdateUserData(location, navigate);
        // this.isLoading = false;
    }

    ChangeOccupiedSpace(occupiedSpace) {
        if (!this.user) 
            return false;

        this.user.occupiedSpace = occupiedSpace;
    }

    IsUserInFriends = (userId) => {
        const user = this.friends.find(user => 
            (user.userId === userId || user.ownerId === userId));

        return user != null;
    }

    AddFriend = (targetFriend) => {
        const friend = this.FindFriendById(targetFriend.userId);

        if (friend)
            return false;

        this.friends = [targetFriend, ...this.friends];
    }

    RemoveFriend = (userId, ownerId) => {
        const IsCurrentFriendNotTarget = (friend) => {
            const isUserOwner = friend.userId === userId && friend.ownerId == ownerId;
            const isFriendOwner = friend.ownerId === userId && friend.userId === ownerId;

            return !(isUserOwner || isFriendOwner);
        }

        this.friends = this.friends.filter(IsCurrentFriendNotTarget);
    }

    GetFriendsRequests = () => {
        // return this.friends
        //     .filter(element => element.isSubmited === false && element.userId === this.user.id);
    }

    SetCountNotifications = () => {
        // this.countNotifications = this.GetFriendsRequests().length;
    }

    SetFriend = (friend) => {
        const targetFriend = this.FindFriendById(friend.id)

        if (!targetFriend)
            return false;

        targetFriend = {...targetFriend, ...friend};
    }

    ChangeFriendState = (id) => {
        const friend = this.FindFriendById(id);

        if (!friend) 
            return false;

        friend.isSubmited = true;
        this.user.friendCount++;
    }

    AddCommunity = (community) => {
        const targetCommunity = this.FindCommunityById(community.id);

        if (!targetCommunity)
            return false;

        this.communities = [community, ...this.communities];
    }
}

export default new UserState();