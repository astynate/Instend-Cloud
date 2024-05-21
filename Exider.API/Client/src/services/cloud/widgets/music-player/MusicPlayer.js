import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import musicState from '../../../../states/music-state';
import { instance } from '../../../../state/Interceptors';
import { convertSecondsToTicks } from '../../../../utils/TimeHandler';

const MusicPlayer = observer(() => {
    const { isPlaying } = musicState;
    const audioRef = useRef(null);

    const handleTimeUpdate = () => {
        musicState.setTime(convertSecondsToTicks(audioRef.current.currentTime));
    };

    const handleProgress = () => {
        const audio = audioRef.current;
        
        if (audio && audio.buffered.length > 0) {
            const loaded = audio.buffered.end(audio.buffered.length - 1);
            const total = audio.duration;
            const loadedPercentage = (loaded / total) * 100;
            
            musicState.setProgress(loadedPercentage);
        }
    };

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (musicState.songQueue && musicState.songQueue.length > 0 && musicState.songQueue[musicState.currentSongIndex].id) {
            const getMusic = async () => {
                try {
                    const response = await instance.get(`/api/music?id=${musicState.songQueue[musicState.currentSongIndex].id}`, { responseType: 'blob' });
                    if (audioRef.current) {
                        audioRef.current.src = URL.createObjectURL(response.data);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            getMusic();
        }
    }, [musicState.songQueue, musicState.currentSongIndex]);

    return (
        <audio 
            ref={audioRef} 
            className={styles.player} 
            controls 
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
        />
    );
});

export default MusicPlayer;