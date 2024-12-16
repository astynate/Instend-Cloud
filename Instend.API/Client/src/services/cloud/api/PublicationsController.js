import { instance } from "../../../state/application/Interceptors";
import NewsState from "../../../state/entities/NewsState";

class PublicationsController {
    static AddPublication = async (text, attachments, onStart = () => {}, onSuccess = () => {}, onError = () => {}) => {
        let form = new FormData();
        
        form.append('text', text);

        for (let attachment of attachments) {
            form.append('attachments', attachment.file);
        }

        onStart();
        
        await instance
            .post('api/publications', form)
            .then(response => {
                if (response && response.data) {
                    console.log(response.data);
                    NewsState.addNews([response.data]);
                }

                onSuccess();
            })
            .catch(e => {
                console.error(e);
                onError();
            });
    }
    
    static UpdatePublication = async (id, text, attachments, setLoadingState) => {
        let form = new FormData();
        
        form.append('id', id);
        form.append('text', text);

        for (let i = 0; i < attachments.length; i++) {
            form.append(`attachments[${i}].Id`, attachments[i].id);
            form.append(`attachments[${i}].Attachment`, attachments[i].file ?? null);
        }

        setLoadingState(true);
        
        await instance
            .put('api/publications', form)
            .then(_ => {
                setLoadingState(false);
            })
            .catch(e => {
                console.error(e);
                setLoadingState(false);
            });
    }

    static Delete = async (id) => {
        await instance
            .delete(`api/publications?id=${id}`)
            .then(_ => {
                NewsState.deletePublication(id);
            });
    }

    static React = async (publicationId, reactionId) => {
        await instance
            .post(`api/publications-activity?publicationId=${publicationId}&reactionId=${reactionId}`);
    }
}

export default PublicationsController;