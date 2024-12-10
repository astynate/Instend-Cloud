import { instance } from "../state/application/Interceptors";
import NewsState from "../state/entities/NewsState";

class NewsController {
    static SetNewsRequest = async (lastPublicationDate = '') => {
        await instance
            .get(`api/news?lastPublicationDate=${lastPublicationDate}`)
            .then((response) => {
                if (!response) {
                    return;
                }

                if (response.data && response.data.length && response.data.length > 0) {
                    NewsState.addNews(response.data);
                }

                NewsState.setHasMoreState(response.data.length && response.data.length >= 5);
            })
            .catch(e => {
                console.error(e);
            });
    }
}

export default NewsController;