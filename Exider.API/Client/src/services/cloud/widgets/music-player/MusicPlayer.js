import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import musicState from '../../../../states/music-state';
import { instance } from '../../../../state/Interceptors';
import { convertSecondsToTicks, convertTicksToSeconds } from '../../../../utils/TimeHandler';

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

    const isTimeInRange = (value, target, step) => {
        return (value + step) < target || (value - step) > target;
    }

    useEffect(() => {
        const audio = audioRef.current;
        const newTime = convertTicksToSeconds(musicState.time);

        if (audio && audio.currentTime >= audio.duration) {
            musicState.TurnOnNextSong();
            audio.currentTime = 0;

            if (musicState.repeatState === 2) {
                audio.play();
            }
            
            return;
        }
        
        if (audio && isTimeInRange(audio.currentTime, newTime, 5)) {
            audio.currentTime = newTime;
        }
    }, [musicState.time]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);
    
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        }
    }, [musicState.songQueue, musicState.currentSongIndex]);

    return (
        musicState.songQueue.length > 0 && 
        <audio 
            key={musicState.songQueue[musicState.currentSongIndex].id}
            ref={audioRef} 
            className={styles.player} 
            controls 
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
        >
            <source src={`http://192.168.1.63:5000/api/storage/file?id=${musicState.songQueue[musicState.currentSongIndex].id}&token=${localStorage.getItem('system_access_token')}`} />
        </audio>
    );
});

export default MusicPlayer;