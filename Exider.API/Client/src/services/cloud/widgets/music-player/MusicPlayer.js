import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import musicState from '../../../../states/music-state';

const MusicPlayer = observer(({songs}) => {
    const { songQueue, currentSongIndex, isPlaying } = musicState;
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            // audioRef.current.play();
        } else if (!isPlaying && audioRef.current) {
            // audioRef.current.pause();
        }
    }, [isPlaying]);

    const src = songQueue && songQueue[currentSongIndex] ? songQueue[currentSongIndex].src : '';

    return (
        <audio ref={audioRef} className={styles.player} src={src} controls />
    );
});

export default MusicPlayer;