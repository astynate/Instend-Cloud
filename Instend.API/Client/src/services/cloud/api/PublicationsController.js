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
}

export default PublicationsController;