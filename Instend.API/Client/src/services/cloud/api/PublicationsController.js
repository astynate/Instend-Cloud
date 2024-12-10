import { instance } from "../../../state/application/Interceptors";

class PublicationsController {
    static AddPublication = async (text, attachments, setLoadingState) => {
        let form = new FormData()
        
        form.append('text', text);
        
        for (let i = 0; i < attachments.length; i++) {
            form.append('files', attachments[i]);
        }

        setLoadingState(true);
        
        await instance
            .post('api/publications', form)
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