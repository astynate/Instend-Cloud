import { instance } from "../../../state/application/Interceptors";

class PublicationsController {
    static AddUploadingComment = async (route, text, attachments = [], user, itemId, comments, setComments, queueId, setQueueId) => {
        const commentBody = {
            text,
            attachments: attachments
        };
        
        const comment = {
            comment: commentBody,
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
            
            for(let i = 0; i < attachments.length; i++) {
                form.append('files', attachments[i]);
            }
            
            await instance
                .post(route, form)
                .catch(error => {
                    console.error(error);
                    DeleteCommentByQueueId(comment.queueId, itemId);
                })
        }
        
        setQueueId(queueId++);
    }
}

export default PublicationsController;