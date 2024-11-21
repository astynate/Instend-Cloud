import styles from './main.module.css';
import likeImage from './images/like.png';
import commentImage from './images/comment.png';
import shareImage from './images/share.png';

const PublicationControlPanel = () => {
    return (
        <div className={styles.control}>
            <div className={styles.buttons}>
                <button className={styles.button}>
                    <img src={likeImage} draggable="false" />
                </button>
                <button className={styles.button}>
                    <img src={commentImage} draggable="false" />
                </button>
                <button className={styles.button}>
                    <img src={shareImage} draggable="false" />
                </button>
            </div>
            <div className={styles.statistics}>
                <span><b>120K </b>Comments</span>
                <span><b>100M </b>Views</span>
            </div>
        </div>
    );
};

export default PublicationControlPanel;