import styles from './main.module.css';
import userState from "../../../../../../state/entities/UserState";
import MainContentWrapper from "../../../../features/main-content-wrapper/MainContentWrapper";
import Comments from "../../../../widgets/social/comments/Comments";
import Pagination from '../../../../elements/pagination/Pagination';
import newsState from '../../../../../../states/NewsState';
import { observer } from "mobx-react-lite";
import checkMark from './check-mark.png';

const News = observer(() => {
    return (
        <MainContentWrapper>
            <div className={styles.border}>
                <Comments 
                    setLike={newsState.setLike}
                    isPublications={true}
                    isPublicationAvailable={false}
                    fetch_callback={newsState.setNews}
                    comments={newsState.news}
                    id={userState.user.id}
                    setUploadingComment={() => {}}
                    deleteCallback={async (id) => {
                        // await instance.delete(`/api/album-comments?id=${id}&albumId=${userState.user.id}&type=${2}`)
                    }}
                />
                <Pagination 
                    fetchRequest={newsState.setNews} 
                    isHasMore={newsState.isHasMore}
                    placeholder={
                        <div className={styles.placeholder}>
                            <div className={styles.imageWrapper}>
                                <img src={checkMark} className={styles.image} draggable="false" />
                            </div>
                            <h1 className={styles.title}>You watched all posts</h1>
                            <span className={styles.information}>This news includes communities you follow.</span>
                        </div>
                    }
                />
            </div>
        </MainContentWrapper>
    );
});

export default News;