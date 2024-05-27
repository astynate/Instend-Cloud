import React from 'react';
import styles from './main.module.css';
import Song from '../../../../pages/music/shared/song/Song';
import musicState from '../../../../../../states/music-state';
import storageState from '../../../../../../states/storage-state';
import { observer } from 'mobx-react-lite';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';

const SongQueue = observer(({openState, children}) => {
    return (
        <div className={styles.songQueue} id={openState ? "open" : null}>
            <div className={styles.queue}>
                <Title title='Queue' />
                <div className={styles.songs}>
                    {musicState.songQueue.map(element => {
                        return (
                            <Song 
                                isShort={true}
                                key={element.id}
                                song={storageState.FindFileById(element.id)}
                                isPlaying={element.id === musicState.GetCurrentSongId() && musicState.isPlaying}
                            />
                        );
                    })}
                </div>
            </div>
            {children}
        </div>
    );
});

export default SongQueue;