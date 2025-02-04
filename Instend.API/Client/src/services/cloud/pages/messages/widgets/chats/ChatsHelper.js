import StorageController from "../../../../../../api/StorageController";
import AccountState from "../../../../../../state/entities/AccountState";
import DirectsController from "../../../../api/DirectsController";
import GroupsController from "../../../../api/GroupsController";

class ChatsHelper {
    static GetChatData = (chat) => {
        const { account } = AccountState;

        if (chat.type === 'direct') {
            const chatAccount = chat.ownerId === account.id ? chat.account : chat.owner;

            return {
                avatar: StorageController.getFullFileURL(chatAccount.avatar),
                name: `${chatAccount.name} ${chatAccount.surname}`,
            };
        };

        if (chat.type === 'group') {
            return {
                avatar: StorageController.getFullFileURL(chat.avatarPath),
                name: chat.name,
                numberOfMembers: chat.members.length
            };
        };

        return {
            avatar: '',
            name: ''
        };
    };

    static DeleteChat = async (chat) => {
        switch (chat.type) {
            case 'direct': {
                let id = AccountState.account.id === chat.ownerId ? chat.accountId : chat.ownerId;
                await DirectsController.DeleteDirect(id);
                break;
            }
            case 'group': {
                await GroupsController.DeleteGroup(chat.id);
                break;
            }
        };
    };
};

export default ChatsHelper;