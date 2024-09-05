import React from 'react';
import styles from './main.module.css';
import play from './images/play.png';
import pause from './images/pause.png';
import defaultCover from './images/default-playlist-cover.png';
import Loader from '../../../../shared/loader/Loader';
import { observer } from 'mobx-react-lite';

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
                />
            </div>
            {isLoading && <div className={styles.loader}>
                <Loader />
            </div>}
            {song && song.fileAsBytes ?
                <img
                    src={`data:image/png;base64,${song.fileAsBytes}`} 
                    className={styles.albumCoverImage} 
                    draggable="false" 
                />
            :
                <img 
                    src={defaultCover} 
                    className={styles.albumCoverImage} 
                    draggable="false" 
                />
            }
        </div>
    )
});

export default SongCover;