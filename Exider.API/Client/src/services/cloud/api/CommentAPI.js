import { instance } from "../../../state/Interceptors";
import applicationState from "../../../states/application-state";

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
    if (!attachments) {
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
                applicationState.AddErrorInQueue(error.response.data);
                DeleteCommentByQueueId(comment.queueId, itemId);
            })
    }
    
    setQueueId(queueId++);
}

export const DeleteCommentByQueueId = async () => {

}