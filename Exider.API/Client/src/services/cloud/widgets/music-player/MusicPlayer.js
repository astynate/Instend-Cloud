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

    // const isTimeInRange = (value, target, step) => {
    //     return (value + step) < target || (value - step) > target;
    // }

    // useEffect(() => {
    //     const audio = audioRef.current;
    //     const newTime = convertTicksToSeconds(musicState.time);

    //     if (audio.currentTime >= audio.duration) {
    //         musicState.TurnOnNextSong();
    //         audio.currentTime = 0;

    //         if (musicState.repeatState === 2) {
    //             audio.play();
    //         }
            
    //         return;
    //     }
        
    //     if (isTimeInRange(audio.currentTime, newTime, 5)) {
    //         audio.currentTime = newTime;
    //     }
    // }, [musicState.time]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // useEffect(() => {
    //     if (musicState.songQueue && 
    //         musicState.songQueue.length > 0 && 
    //         musicState.songQueue[musicState.currentSongIndex] &&
    //         musicState.songQueue[musicState.currentSongIndex].id) {
    //         const getMusic = async () => {
    //             try {
    //                 const response = await instance.get(`/api/music?id=${musicState.songQueue[musicState.currentSongIndex].id}`, { responseType: 'blob' });
                    
    //                 if (audioRef.current) {
    //                     audioRef.current.pause();
    //                     await new Promise(r => setTimeout(r, 300));
    //                     const blob = new Blob([response.data], { type: 'audio/mpeg' });
    //                     const url = URL.createObjectURL(blob);
    //                     audioRef.current.src = url;
    //                     audioRef.current.load();
    //                     if (isPlaying) {
    //                         audioRef.current.play();
    //                     }
    //                 }
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         };
            
    //         getMusic();
    //     }
    // }, [musicState.songQueue, musicState.currentSongIndex]);    

    return (
        musicState.songQueue.length > 0 && 
        <audio 
            ref={audioRef} 
            className={styles.player} 
            controls 
            onTimeUpdate={handleTimeUpdate}
            onProgress={handleProgress}
        >
            <source src={`http://192.168.1.63:5000/api/music?id=${musicState.songQueue[musicState.currentSongIndex].id}`} />
        </audio>
    );
});

export default MusicPlayer;