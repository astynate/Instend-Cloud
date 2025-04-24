import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import play from './images/play.png';
import pause from './images/pause.png';
import defaultCover from '../../../../assets/default/song-cover.png';

const SongCover = observer(({song, isPlaying, isLoading, isHovered}) => {
    return (
        <div className={styles.albumCover}>
            {isPlaying && <div className={styles.loader}>
                <div className={styles.barWrapper}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>}
            <div className={styles.playing} id={isHovered ? 'open' : null}>
                <img 
                    src={isPlaying ? pause : play}
                    className={styles.playImage}
                    draggable="false"
                />
            </div>
            <img 
                src={defaultCover} 
                className={styles.albumCoverImage} 
                draggable="false" 
            />
        </div>
    );
});

export default SongCover;