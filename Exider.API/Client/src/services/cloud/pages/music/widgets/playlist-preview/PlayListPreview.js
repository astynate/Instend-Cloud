import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';

const PlayListPreview = () => {
    return (
        <div className={styles.albumView}>
            <div className={styles.view}>
                <img 
                    src={defaultCover} 
                    className={styles.cover}
                />
                <div className={styles.buttonWrapper}>
                    <PlayButton 
                        callback={() => alert('!')}
                    />
                </div>
            </div>
            <div className={styles.description}>
                <span className={styles.title}>Name</span>
                <span className={styles.time}>Show more</span>
            </div>
        </div>
    );
 };

export default PlayListPreview;