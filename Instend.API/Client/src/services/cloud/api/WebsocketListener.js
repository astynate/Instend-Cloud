class WebsocketListener {
    static CreateFolderListener = async ([folder, queueId]) => {
        await connectToFoldersListener();
        await storageState.ReplaceLoadingFolder(folder, queueId);
    };

    static UploadFileListener = async ([file, queueId, occupiedSpace, meta]) => {
        file.meta = meta;
        userState.ChangeOccupiedSpace(occupiedSpace);
        storageState.ReplaceLoadingFile(file, queueId);

        if (imageTypes.includes(file.type)) {
            galleryState.ReplaceLoadingPhoto(file, queueId);
        }
    };

    static DeleteFileListener = (data) => {
        storageState.DeleteFile(data);
        musicState.DeleteSong(data);
    };

    static PinnedStateChangesListener = (data) => {
        const { chatId, messageId, state } = JSON.parse(data);
        chatsState.UpdateMessagePinnedState(chatId, messageId, state);
    };

    static DeleteMessageListener = (data) => {
        const { chatId, messageId } = JSON.parse(data);
        chatsState.DeleteMessage(chatId, messageId);
    };

    static UploadFileListener = ([file, albumId, queueId]) => {
        storageState.ReplaceLoadingFile(file, queueId);
        galleryState.ReplaceLoadingPhoto(file, queueId, albumId);
    };

    static AddCommentListner = ({comment, user, albumId, queueId}) => {
        galleryState.ReplaceLoadingComment({comment: comment, user: user}, queueId, albumId);
    };

    static DirectAccessChangeListner = (data) => {
        const { id, state } = JSON.parse(data);
        chatsState.UpdateDirectAccessState(id, state);
    };

    static GetChatsListner = (chats) => {
        chatsState.SetChats(chats);
        chatsState.setChatsLoadedState(true);
    };

    static ReceiveMessageListner = (data) => {
        const { model, messageModel, userPublic, queueId } = JSON.parse(data);

        if (model) {
            chatsState.AddMessage(
                model, 
                messageModel, 
                userPublic, 
                queueId
            );
        }

        if (chatsState.draft && chatsState.draft.id && userPublic.id === chatsState.draft.id) {
            navigate(`/messages/${userPublic.id}`);
            chatsState.setDraft(null);
        }
    };

    static ConnectToGroupListner = (id) => {
        const object = {
            id: id,
            authorization: localStorage.getItem('system_access_token')
        };

        globalWSContext.connection.invoke('ConnectToGroup', object);
    };

    static LeaveGroupListner = (data) => {
        const { id, user } = JSON.parse(data);
        chatsState.DeleteChat(id, user);
    };

    static DeleteDirectoryListner = (id) => chatsState.DeleteChat(id, userState.user.id);
    static ViewMessageListner = ({ id, chatId }) => chatsState.ViewMessage(id, chatId);
    static NewConnectionListner = async (id) => await connectToDirectListener(id);
    static UpdateOccupiedSpaceListner = (space) => userState.ChangeOccupiedSpace(space);
    static DeleteCommentListner = (id) => galleryState.DeleteCommentById(id);
    static AddToAlbumListner = ([file, albumId]) => galleryState.AddToAlbum(file, albumId);
    static DeleteAlbumListner = (id) => galleryState.DeleteAlbumById(id);
    static UpdateAlbumListner = ({id, coverAsBytes, name, description}) => galleryState.UpdateAlbum(id, coverAsBytes, name, description);
    static CreateAlbumListner = ([album, queueId]) => galleryState.ReplaceLoadingAlbum(album, queueId);
    static RenameFileListener = (data) => storageState.RenameFile(data);
    static RenameFolderListener = (data) => storageState.RenameFolder(data);
    static DeleteFolderListener = (data) => storageState.DeleteFolder(data);
}

export default WebsocketListener;