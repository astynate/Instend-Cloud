import React from 'react';
import styles from './main.module.css';
import Song from '../../../../pages/music/shared/song/Song';
import musicState from '../../../../../../states/music-state';
import storageState from '../../../../../../states/storage-state';
import { observer } from 'mobx-react-lite';

const SongQueue = observer(({openState}) => {
    return (
        <div className={styles.songQueue} id={openState ? "open" : null}>
            <div className={styles.queue}>
                <span className={styles.title}>Queue</span>
                {musicState.songQueue.map(element => {
                    return (
                        <Song 
                            key={element.id}
                            song={storageState.FindFileById(element.id)}
                            isPlaying={element.id === musicState.GetCurrentSongId() && musicState.isPlaying}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default SongQueue;