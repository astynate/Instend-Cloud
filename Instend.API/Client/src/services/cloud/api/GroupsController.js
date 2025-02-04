import { instance } from "../../../state/application/Interceptors";
import { globalWSContext } from "../layout/Layout";
import ChatsState from "../../../state/entities/ChatsState";

class GroupsController {
    static CreateGroup = async (name, avatar, onSuccess = () => {}) => {
        if (!globalWSContext.connection) {
            return false;
        }

        const form = new FormData();

        form.append('name', name);
        form.append('avatar', avatar);
        form.append('connectionId', globalWSContext.connection.connectionId);

        await instance
            .post('api/groups', form)
            .then(_ => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
            });
    };

    static GetGroups = async (skip, take) => {
        await instance
            .get(`/api/groups/all?skip=${skip}&take=${take}`)
            .then(response => {
                if (response && response.data && response.data.length) {
                    ChatsState.setHasMoreGroups(response.data.length >= 5);
                    ChatsState.increaseNumberOfLoadedGroups(response.data.length);

                    for (let chat of response.data) {
                        ChatsState.addChat(chat);
                    };
                };
            });
    };

    static DeleteGroup = async (id) => {
        await instance
            .delete(`/api/groups?id=${id}`)
            .catch(error => {
                console.error(error);
            });
    };
};

export default GroupsController;