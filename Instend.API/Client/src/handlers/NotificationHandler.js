import StorageController from "../api/StorageController";
import AccountState from "../state/entities/AccountState";
import Base64Handler from "./Base64Handler";

class NotificationHandler {
    static Notify (title='', params={}) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, params);
            };
        });
    };

    static NotifyAboutMessage (transferModel) {
        if (AccountState.account.id == transferModel.account.id) {
            return;
        };

        const lastMessageIndex = Math.max(transferModel.messages.length - 1, 0);
        const title = `${transferModel.account.name} ${transferModel.account.name}`;
        const body = transferModel.messages[lastMessageIndex].text;
        const icon = Base64Handler.Base64ToUrlFormatPng(StorageController.getFullFileURL(transferModel.account.avatar));
        
        this.Notify(title, {body: body, icon: icon});
    };
};

export default NotificationHandler;