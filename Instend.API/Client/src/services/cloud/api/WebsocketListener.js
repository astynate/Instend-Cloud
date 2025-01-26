import GlobalContext from "../../../global/GlobalContext";
import ChatsState from "../../../state/entities/ChatsState";
import GalleryState from "../../../state/entities/GalleryState";
import MusicState from "../../../state/entities/MusicState";
import StorageState from "../../../state/entities/StorageState";
import AccountState from "../../../state/entities/AccountState";

class WebsocketListener {
    static CreateCollectionListener = async (data) => {
        const [collection, queueId] = JSON.parse(data);
        await StorageState.ReplaceLoadingCollection(collection, queueId);
    };

    static UploadFileListener = async ([file, queueId, occupiedSpace, meta]) => {
        file.meta = meta;
        
        AccountState.ChangeOccupiedSpace(occupiedSpace);
        StorageState.ReplaceLoadingFile(file, queueId);

        if (GlobalContext.supportedImageTypes.includes(file.type)) {
            GalleryState.ReplaceLoadingPhoto(file, queueId);
        }
    };

    static DeleteFileListener = (data) => {
        StorageState.DeleteFile(data);
        // MusicState.DeleteSong(data);
    };

    static PinnedStateChangesListener = (data) => {
        const { chatId, messageId, state } = JSON.parse(data);
        ChatsState.UpdateMessagePinnedState(chatId, messageId, state);
    };

    static DeleteMessageListener = (data) => {
        const { chatId, messageId } = JSON.parse(data);
        ChatsState.DeleteMessage(chatId, messageId);
    };

    static UploadFileListener = ([file, queueId]) => {
        console.log(file);
        StorageState.ReplaceLoadingFile(file, queueId);
        // GalleryState.ReplaceLoadingPhoto(file, queueId, albumId);
    };

    static AddCommentListner = ({comment, user, albumId, queueId}) => {
        GalleryState.ReplaceLoadingComment({comment: comment, user: user}, queueId, albumId);
    };

    static DirectAccessChangeListner = (data) => {
        const { id, state } = JSON.parse(data);
        ChatsState.UpdateDirectAccessState(id, state);
    };

    static GetChatsListner = (chats) => {
        ChatsState.SetChats(chats);
        ChatsState.setChatsLoadedState(true);
    };

    static ReceiveMessageListner = (data) => {
        const { model, message, account, queueId } = JSON.parse(data);

        if (model) {
            ChatsState.AddMessage(
                model, 
                message, 
                account, 
                queueId
            );
        }

        if (ChatsState.IsDraftWithTargetUser(account.id)) {
            // navigate(`/messages/${account.id}`);
            ChatsState.setDraft(null);
        }
    };

    static ConnectToGroupListner = (id) => {
        const object = {
            id: id,
            authorization: localStorage.getItem('system_access_token')
        };

        // globalWSContext.connection.invoke('ConnectToGroup', object);
    };

    static LeaveGroupListner = (data) => {
        const { id, user } = JSON.parse(data);
        ChatsState.DeleteChat(id, user);
    };

    static DeleteDirectoryListner = (id) => ChatsState.DeleteChat(id, AccountState.user.id);
    static ViewMessageListner = ({ id, chatId }) => ChatsState.ViewMessage(id, chatId);
    static NewConnectionListner = async (id) => {};
    static UpdateOccupiedSpaceListner = (space) => AccountState.ChangeOccupiedSpace(space);
    static DeleteCommentListner = (id) => GalleryState.DeleteCommentById(id);
    static AddToAlbumListner = ([file, albumId]) => GalleryState.AddToAlbum(file, albumId);
    static DeleteAlbumListner = (id) => GalleryState.DeleteAlbumById(id);
    static UpdateAlbumListner = ({id, coverAsBytes, name, description}) => GalleryState.UpdateAlbum(id, coverAsBytes, name, description);
    static CreateAlbumListner = ([album, queueId]) => GalleryState.ReplaceLoadingAlbum(album, queueId);
    static RenameFileListener = (data) => StorageState.RenameFile(data);
    static RenameCollectionListener = (data) => StorageState.RenameCollection(data);
    static RemoveCollectionListener = (data) => StorageState.RemoveCollection(data);
};

export default WebsocketListener;