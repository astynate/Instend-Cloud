import React, { useState } from 'react';
import styles from './main.module.css';
import { convertFromTimespan } from '../../../../../../utils/TimeHandler';
import musicState from '../../../../../../states/music-state';
import SongCover from '../../../../shared/ui-kit/song/song-cover/SongCover';
import { observer } from 'mobx-react-lite';
import SelectUIElements from '../../../../elements/select/SelectUIElements';

const Song = observer(({index, song, isPlaying, isLoading, isShort, isSelect, setQueue, setSelectedFiles}) => {
    const [isHovered, setHoveredState] = useState(false);
    const [isSelected, setSelectedState] = useState(false);

    if (!song) { return null; }

    return (
        <div 
            className={`${styles.song} ${isSelect ? styles.select : ''}`} 
            id={isShort ? "short" : null}
            onMouseEnter={() => setHoveredState(true)}
            onMouseLeave={() => setHoveredState(false)}
            data={song.id ? song.id : null}
        >
            <div className={styles.name}>
                {index && <span className={styles.index}>{index}</span>}
                <div className={styles.albumCover} onClick={() => {
                    if (setQueue) {
                        setQueue();
                    }
                    if (song && song.id) {
                        musicState.SetSongAsPlaying(song.id);
                    }
                }}>
                    <SongCover 
                        song={song}
                        isLoading={isLoading}
                        isPlaying={isPlaying}
                        isHovered={isHovered}
                    />
                </div>
                {isShort ? 
                    <div className={styles.artistName}>
                        <span className={styles.item} id='name'>{song && song.title ? song.title : song && song.name ? song.name : 'Not set'}</span>
                        <span className={styles.item}>{song && song.artist ? song.artist : 'Unknown'}</span>
                    </div>
                : 
                    <span className={styles.item}>{song && song.title ? song.title : song && song.name ? song.name : 'Not set'}</span>
                }
            </div>
            {!isShort &&
                <>
                    <span className={styles.item}>{song && song.artist}</span>
                    <span className={styles.item}>{song && song.plays}</span>
                </>
            }
            <span 
                className={styles.item}
            >
                {song && song.duration && convertFromTimespan(song.duration)}
            </span>
            <div className={styles.selectBoxWrapper}>
                {setSelectedFiles && 
                    <SelectUIElements
                        isSelected={isSelected}
                        setSelectedState={setSelectedState}
                        isSelectedOpen={true}
                        setSelectedFiles={setSelectedFiles}
                        element={song ?? {id: undefined}}
                        top={10}
                        right={0}
                    />}
            </div>
        </div>
    );
});

export default Song;