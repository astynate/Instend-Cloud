import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import { convertFromTimespan } from '../../../../../../utils/TimeHandler';

const Song = ({index, song}) => {
    return (
        <div className={styles.song}>
            <div className={styles.name}>
                <span className={styles.index}>{index}</span>
                <div className={styles.albumCover}>
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
                <span className={styles.item}>{song.title ? song.title : song.name}</span>
            </div>
            <span className={styles.item}>{song.artist}</span>
            <span className={styles.item}>{song.plays}</span>
            <span className={styles.item}>{convertFromTimespan(song.duration)}</span>
        </div>
    );
}

export default Song;