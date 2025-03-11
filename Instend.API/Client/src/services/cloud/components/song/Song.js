import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { convertFromTimespan } from '../../../../handlers/TimeHandler';
import styles from './main.module.css';
import MusicState from '../../../../state/entities/MusicState';
import SongCover from '../song-cover/SongCover';

const Song = observer(({song, isLoading, isShort, isSelect, setQueue = () => {}}) => {
    const [isHovered, setHoveredState] = useState(false);
    const { IsSongIsPlaying, SetSongAsPlaying } = MusicState;

    if (!song) { 
        return null; 
    };

    return (
        <div 
            className={`${styles.song} ${isSelect ? styles.select : ''}`} 
            id={isShort ? "short" : null}
            data={song.id ? song.id : null}
            onMouseEnter={() => setHoveredState(true)}
            onMouseLeave={() => setHoveredState(false)}
        >
            <div className={styles.name}>
                <div 
                    className={styles.albumCover} 
                    onClick={() => {
                        if (setQueue) {
                            setQueue();
                        };

                        if (song && song.id) {
                            SetSongAsPlaying(song);
                        };
                    }}
                >
                    <SongCover
                        song={song}
                        isLoading={isLoading}
                        isPlaying={IsSongIsPlaying(song.id)}
                        isHovered={isHovered}
                    />
                </div> 
                <div className={styles.artistName}>
                    <span className={styles.item} id='name'>{song && song.title ? song.title : song && song.name ? song.name : 'No name'}</span>
                    <span className={styles.item}>{song && song.artist ? song.artist : 'Unknown'}</span>
                </div>
            </div>
            <span className={styles.item}>{song && song.artist}</span>
            <span className={styles.item}>{song && song.plays}</span>
            <span className={styles.item}>
                {song && song.duration && convertFromTimespan(song.duration)}
            </span>
        </div>
    );
});

export default Song;