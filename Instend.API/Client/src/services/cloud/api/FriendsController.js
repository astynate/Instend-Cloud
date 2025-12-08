import ApplicationState from "../../../state/application/ApplicationState";
import { instance } from "../../../state/application/Interceptors";

class FriendsController {
    static GetFriendsById = async (id, onSuccess = () => {}) => {
        await instance
            .get(`api/followers/friends?id=${id ?? ''}`)
            .then(response => {
                if (response.data && response.data.length) {
                    onSuccess(response.data.map(friend => {
                        if (friend.account.id === id) {
                            return friend.follower;
                        } else {
                            return friend.account;
                        };
                    }))
                } else {
                    onSuccess([]);
                };
            })
            .catch((error) => { 
                // ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    };
};

export default FriendsController;