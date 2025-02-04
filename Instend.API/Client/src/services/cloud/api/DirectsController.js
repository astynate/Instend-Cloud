import { instance } from "../../../state/application/Interceptors";
import ChatsState from "../../../state/entities/ChatsState";

class DirectsController {
    static GetAccountsDirects = async (skip, take) => {
        await instance
            .get(`/api/directs/all?skip=${skip}&take=${take}`)
            .then(response => {
                if (response && response.data && response.data.length) {
                    ChatsState.setHasMoreDirects(response.data.length >= 5);
                    ChatsState.increaseNumberOfLoadedDirects(response.data.length);

                    for (let chat of response.data) {
                        ChatsState.addChat(chat);
                    };
                };
            });
    };

    static DeleteDirect = async (id) => {
        await instance
            .delete(`api/directs?accountId=${id}`);
    };

    static AcceptDirect = async (id) => {
        await instance
            .put(`api/directs/accept?id=${id}`);
    };
};

export default DirectsController;