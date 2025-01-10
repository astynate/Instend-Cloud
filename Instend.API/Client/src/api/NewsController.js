import { instance } from "../state/application/Interceptors";
import NewsState from "../state/entities/NewsState";

class NewsController {
    static SetNewsRequest = async (lastPublicationDate = '') => {
        await instance
            .get(`api/news?lastPublicationDate=${lastPublicationDate}`)
            .then((response) => {
                if (!response || !response.data || !response.data.length) {
                    NewsState.setHasMoreState(false);
                    return;
                }

                if (response.data && response.data.length && response.data.length > 0) {
                    NewsState.addNews(response.data);
                }

                NewsState.setHasMoreState(response.data.length >= 5);
            })
            .catch(e => {
                console.error(e);
            });
    }

    static GetAccountPublications = async (accountId, lastPublicationDate = '', setPublications, setHasMoreState) => {
        await instance
            .get(`api/account/publications?lastPublicationDate=${lastPublicationDate}&accountId=${accountId}`)
            .then((response) => {
                if (!response || !response.data || !response.data.length) {
                    setHasMoreState(false);
                    return;
                }

                if (response.data && response.data.length && response.data.length > 0) {
                    setPublications(prev => [...prev, ...response.data]);
                }

                setHasMoreState(response.data.length >= 5);
            })
            .catch(e => {
                console.error(e);
            });
    }
}

export default NewsController;