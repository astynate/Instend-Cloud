import { instance } from "../state/application/Interceptors"
import AccountState from "../state/entities/AccountState";

class FollowersController {
    static Follow = async (id) => {
        AccountState.ChangeFollowingState(id);

        await instance
            .post(`/api/followers?id=${id}`)
            .catch(error => {
                console.error(error);
            });
    }
}

export default FollowersController;