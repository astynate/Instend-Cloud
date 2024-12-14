import { instance } from "../../../state/application/Interceptors";
import NewsState from "../../../state/entities/NewsState";

class PublicationsController {
    static AddPublication = async (text, attachments, setLoadingState) => {
        let form = new FormData();
        
        form.append('text', text);

        for (let attachment of attachments) {
            form.append('attachments', attachment.file);
        }

        setLoadingState(true);
        
        await instance
            .post('api/publications', form)
            .then(response => {
                if (response && response.data) {
                    NewsState.addNews([response.data]);
                }

                setLoadingState(false);
            })
            .catch(e => {
                console.error(e);
                setLoadingState(false);
            });
    }
    
    static UpdatePublication = async (id, text, attachments, setLoadingState) => {
        let form = new FormData();
        
        form.append('id', id);
        form.append('text', text);

        console.log(attachments);

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
}

export default PublicationsController;