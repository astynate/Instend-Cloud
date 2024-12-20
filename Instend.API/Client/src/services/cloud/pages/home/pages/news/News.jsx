import { observer } from 'mobx-react-lite';
import PublicationList from '../../../../features/lists/publication-list/PublicationList';
import MainContentWrapper from '../../../../features/wrappers/main-content-wrapper/MainContentWrapper';
import NewsController from '../../../../../../api/NewsController';
import NewsState from '../../../../../../state/entities/NewsState';

const News = observer(() => {
    const getLastNewsDate = () => {
        if (NewsState.news.length === 0) {
            return "";
        }
    
        const lastIndex = NewsState.news.length - 1;
        return NewsState.news[lastIndex].date;
    }

    return (
        <MainContentWrapper>
            <PublicationList 
                publications={NewsState.news} 
                fetchRequest={() => NewsController.SetNewsRequest(getLastNewsDate())} 
                isHasMore={NewsState.isHasMore}
            />
            <br />
            <br />
            <br />
            <br />
            <br />
        </MainContentWrapper>
    );
});

export default News;