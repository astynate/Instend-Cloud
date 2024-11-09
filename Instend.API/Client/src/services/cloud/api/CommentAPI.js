import { instance } from "../../../state/application/Interceptors";
import applicationState from "../../../state/application/ApplicationState";

export const AddUploadingAlbumComment = async (
        route, 
        text, 
        attachments, 
        user, 
        itemId, 
        comments,
        setComments, 
        queueId,
        setQueueId
    ) => {

    if (!!attachments === false) {
        attachments = [];
    }

    const comment = {
        comment: {
            text,
            attachments: attachments
        },
        user: user,
        isUploading: true,
        queueId: queueId
    }

    if (itemId && comments) {
        setComments([comment, ...comments]);
        let form = new FormData()
        
        form.append('text', text);
        form.append('albumId', itemId);
        form.append('queueId', comment.queueId);
        
        for(let i = 0; i < attachments.length; i++){
            form.append('files', attachments[i]);
        }
        
        await instance
            .post(route, form)
            .catch(error => {
                DeleteCommentByQueueId(comment.queueId, itemId);
            })
    }
    
    setQueueId(queueId++);
}