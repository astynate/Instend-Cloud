import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import homeState from "../../../../../states/home-state";
import userState from "../../../../../states/user-state";

export const Follow = async (id) => {
    await instance.put(`api/community/followers?id=${id}`)
        .then(resonse => {
            if (resonse && resonse.data !== null && resonse.data !== undefined) {
                if (resonse.data === true) {
                    userState.AddCommunity({id: id});
                    homeState.UpdateCommunityFollowers(id, 1);
                } else {
                    userState.RemoveCommunity({id: id});
                    homeState.UpdateCommunityFollowers(id, -1);
                }

                return resonse.data;
            }
        })
        .catch(error => {
            applicationState.AddErrorInQueueByError('Attention!', error);
        })
}