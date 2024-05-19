import React from 'react';
import styles from './main.module.css';
import Song from '../../shared/song/Song';

const SongList = ({songs}) => {
    return (
        <div className={styles.songList}>
            <div className={styles.songListHeader}>
                <div className={styles.name}>
                    <span className={styles.item}>#</span>
                    <span className={styles.item}>Name</span>
                </div>
                <span className={styles.item}>Album</span>
                <span className={styles.item}>Plays</span>
                <span className={styles.item}>Time</span>
            </div>
            <div className={styles.songs}>
                {songs && songs.map && songs.map((element, index) => {
                    return (
                        <Song 
                            key={index}
                            index={index + 1}
                            song={element}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default SongList;