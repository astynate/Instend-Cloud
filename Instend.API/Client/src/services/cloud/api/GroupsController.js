import { instance } from "../../../state/application/Interceptors";
import { globalWSContext } from "../layout/Layout";
import ChatsState from "../../../state/entities/ChatsState";

class GroupsController {
    static CreateGroup = async (name, avatar, onSuccess = () => {}) => {
        if (!globalWSContext.connection) {
            return false;
        };

        const form = new FormData();

        form.append('name', name);
        form.append('avatar', avatar);
        form.append('connectionId', globalWSContext.connection.connectionId);

        await instance
            .post('api/groups', form)
            .then(response => {
                if (response && response.data) {
                    onSuccess();
                    ChatsState.addChat(response.data);
                };
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

    static AddGroupMembers = async (id, ids = [], onSuccess = () => {}, onError = () => {}) => {
        const idsQuery = ids.map(id => `ids=${id.id}`).join('&');

        await instance
            .put(`/api/groups/add/members?id=${id}&${idsQuery}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(_ => {
                onSuccess();
            })
            .catch(error => {
                onError();
                console.error(error);
            });
    };

    static RemoveGroupMember = async (id, accountId) => {
        await instance
            .put(`/api/groups/remove/member?id=${id}&accountId=${accountId}`)
            .catch(error => {
                console.error(error);
            });
    };
};

export default GroupsController;