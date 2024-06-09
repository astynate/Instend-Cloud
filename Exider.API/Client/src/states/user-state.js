import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";
import storageState from './storage-state';

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

    SetPublications = (publications) => {
        this.publications = publications;
    }

    setPublicationQueueId = (id) => {
        this.publicationQueueId = id;
    }

    GetPublications = async () => {
        await instance
            .get(`/api/user-publications?id=${this.user.id}`)
            .then(reponse => {
                if (reponse && reponse.data && reponse.data.length && reponse.data.length > 0) {
                    this.publications = reponse.data;
                }
            })
    }

    AddPublication = (comment, queueId) => {
        if (comment) {
            this.publications = this.publications.map(element => {
                if (element.queueId === queueId){
                    element = comment;
                }

                return element;
            });
        }
    }

    DeletePublication = (id) => {
        this.publications = this.publications
            .filter(element => element.comment.id !== id);
    }

    UpdateUserData = async (location, navigate) => {
        try {
            await instance.get('/accounts')
                .then(response => {
                    if (response.data && response.data.length > 2) {
                        this.user = response.data[0];
                        this.friends = response.data[1];
                        this.communities = response.data[2];
                        this.isAuthorize = true;
                    } else {
                        throw new Error("Insufficient data received");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.isAuthorize = false;
                    navigate('/main');
                });

            await storageState.SetFolderItemsById(null);
        } 
        catch (exception) {
            this.isAuthorize = false;
            navigate('/main');
        }
    }

    UpdateAuthorizeState = async (location, navigate) => {
        this.isLoading = true;
        await this.UpdateUserData(location, navigate);
        this.isLoading = false;
    }

    ChangeOccupiedSpace(occupiedSpace) {
        if (this.user) {
            this.user.occupiedSpace = occupiedSpace;
        }
    }

    IsUserInFriends = (userId) => {
        const user = this.friends.find(user => 
            (user.userId === userId || user.ownerId === userId));

        return user != null;
    }

    AddFriend = (friendValue) => {
        let friend = this.friends.find(element => 
            (element.userId === friendValue.userId && element.ownerId == friendValue.ownerId) || 
            (element.ownerId === friendValue.userId && element.userId === friendValue.ownerId));

        if (!friend) {
            this.friends = [friendValue, ...this.friends];
        }
    }

    RemoveFriend = (userId, ownerId) => {
        this.friends = this.friends.filter(element => 
            !((element.userId === userId && element.ownerId == ownerId) || 
              (element.ownerId === userId && element.userId === ownerId)));
    }

    GetFriendsRequests = () => {
        return this.friends
            .filter(element => element.isSubmited === false && element.userId === this.user.id);
    }

    SetCountNotifications = () => {
        this.countNotifications = this.GetFriendsRequests().length;
    }

    GetFriend = (id) => {
        instance.get(`/accounts/id/${id}`)
            .then(response => {
                if (response.data) {
                    let index = this.friends.findIndex(f => f.userId === id || f.ownerId === id);
        
                    if (index !== -1) {
                        this.friends[index] = {...this.friends[index], ...response.data};
                    }
                }
            });    
    }

    ChangeFriendState = (userId, id) => {
        let index = this.friends.findIndex(element => 
            (element.userId === userId && element.ownerId == id) || 
            (element.ownerId === userId && element.userId === id));

        if (index !== -1) {
            this.friends[index].isSubmited = true;
            this.user.friendCount++;
        }
    }

    GetCommunity = async (id) => {
        await instance
            .get(`/api/community/single?id=${id}`)
            .then((response) => {
                if (response.status === 200 && response.data && response.data.ownerId) {
                    const index = this.communities.findIndex(c => c.id === id);

                    if (index !== -1) {
                        this.communities[index] = response.data;
                        return true;
                    }
                }
            })

        return false;
    }

    AddCommunity = (community) => {
        this.communities = [community, ...this.communities];
    }

    RemoveCommunity = (community) => {
        this.communities = this.communities
            .filter(element => element.id !== community.id)
    }
}

export default new UserState();