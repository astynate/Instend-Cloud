import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import userState from "../../../../../states/user-state";

export const Follow = async (id) => {
    await instance.put(`api/community/followers?id=${id}`)
        .then(resonse => {
            if (resonse && resonse.data !== null && resonse.data !== undefined) {
                if (resonse.data === true) {
                    userState.AddCommunity({id: id});
                } else {
                    userState.RemoveCommunity({id: id});
                }
            }
        })
        .catch(error => {
            applicationState.AddErrorInQueueByError('Attention!', error);
        })
}