import { globalWSContext } from "../layout/Layout";
import GlobalContext from "../../../global/GlobalContext";
import ChatsState from "../../../state/entities/ChatsState";
import GalleryState from "../../../state/entities/GalleryState";
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
        StorageState.ReplaceLoadingFile(file, queueId);
    };

    static AddCommentListner = ({comment, user, albumId, queueId}) => {
        GalleryState.ReplaceLoadingComment({comment: comment, user: user}, queueId, albumId);
    };

    static AcceptDirect = (id) => {
        ChatsState.AcceptDirect(id);
    };

    static GetChatsListner = (chats) => {
        ChatsState.addChat(chats);
        ChatsState.setChatsLoadedState(true);
    };

    static ReceiveMessageListner = (data, navigate) => {
        const { transferModel, queueId } = JSON.parse(data);

        if (!transferModel) {
            return false;
        };

        ChatsState.AddMessage(transferModel, queueId);

        if (ChatsState.IsDraftWithTargetUser(transferModel)) {
            navigate(`/messages/${transferModel.id}`);
            ChatsState.setDraft(null);
        };
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

    static NewConnectionListner = async (id) => {
        if (!globalWSContext || !globalWSContext.connection) {
            return false;
        };

        globalWSContext.connection.invoke('ConnectToDirect', id);
    };

    static DeleteDirectListner = (id) => ChatsState.DeleteChat(id);
    static ViewMessageListner = ({ id, chatId }) => ChatsState.ViewMessage(id, chatId);
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