import { instance } from "../state/application/Interceptors";
import UserState from "../state/entities/UserState";

class AccountController {
    static GetAccountData = async (onSuccessCallback = () => {}, onErrorCallback = () => {}) => {
        await instance.get('/accounts')
            .then((response) => {
                if (response && response.data && response.data.length > 2) {
                    onSuccessCallback(response.data);
                } else {
                    onErrorCallback();
                }
            });
    }

    static GetUserPublications = async () => {
        let publications = [];

        await instance
            .get(`/api/user-publications?id=${this.user.id}`)
            .then(reponse => {
                if (reponse && reponse.data && reponse.data.length && reponse.data.length > 0) {
                    publications = reponse.data;
                }
            });

        return publications;
    }

    static GetAccountById = async (id) => {
        let friend = null;

        instance.get(`/accounts/id/${id}`)
            .then(response => {
                if (response.data) {
                    friend = response.data;
                }
            });

        return friend;
    }

    static FollowUser = async (id) => {
        if (id) {
            await instance
                .post(`/api/friends?id=${id}`)
                .then(response => {
                    if (response && response.data) {
                        if (response.data.isRemove) {
                            UserState.RemoveFriend(response.data.userId, response.data.ownerId);
                        } else {
                            UserState.AddFriend(response.data);
                        }
                    }
                });
        }
    }

    static AcceptFriend = async (id) => {
        await instance.put(`/api/friends?id=${id}`)
            .then(response => {
                if (response.data) {
                    const {userId, id} = response.data;
                    UserState.ChangeFriendState(userId, id);
                }
            });
    }
}

export default AccountController;