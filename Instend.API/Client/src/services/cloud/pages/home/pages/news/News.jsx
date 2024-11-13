import { observer } from 'mobx-react-lite';
import PublicationList from '../../../../features/lists/publication-list/PublicationList';
import MainContentWrapper from '../../../../features/wrappers/main-content-wrapper/MainContentWrapper';
import styles from './main.module.css';
import UserState from '../../../../../../state/entities/UserState';

const News = observer(() => {
    return (
        <MainContentWrapper>
            <div className={styles.border}>
                <PublicationList
                    setLike={() => {}}
                    isPublications={true}
                    isPublicationAvailable={false}
                    fetch_callback={() => {}}
                    comments={() => {}}
                    id={UserState.user.id}
                    setUploadingComment={() => {}}
                    deleteCallback={() => {}}
                />
                {/* <Pagination 
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
                /> */}
            </div>
        </MainContentWrapper>
    );
});

export default News;