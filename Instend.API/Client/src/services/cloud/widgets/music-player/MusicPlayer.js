import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import musicState from '../../../../states/music-state';
import { convertSecondsToTicks, convertTicksToSeconds } from '../../../../utils/TimeHandler';
import proxyURLProvider from '../../../../ProxyURLProvider';

const MusicPlayer = observer(() => {
    const { isPlaying } = musicState;
    const audioRef = useRef(null);
    const [isAvailable, setAvailableState] = useState(true);

    console.log(proxyURLProvider.serverUrl);

    const StartPlaying = () => {
        if (isAvailable && audioRef.current) {
            let playPromise = audioRef.current.play();
            setAvailableState(false);
         
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    setAvailableState(true);
                })
                .catch(error => {
                    console.error(error);
                });
            } else {
                setAvailableState(true);
            }
        }
    }

    const StopPlaying = () => {
        if (isAvailable && audioRef.current) {
            setAvailableState(false);
            let pausePromise = audioRef.current.pause();
         
            if (pausePromise !== undefined) {
                pausePromise.then(_ => {
                    setAvailableState(true);
                })
                .catch(error => {
                    console.error(error);
                });
            } else {
                setAvailableState(true);
            }
        }
    }

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
                StartPlaying();
            }
            
            return;
        }
        
        if (audio && isTimeInRange(audio.currentTime, newTime, 5)) {
            audio.currentTime = newTime;
        }
    }, [musicState.time]);

    useEffect(() => {
        if (isPlaying) {
            StartPlaying();
        } else{
            StopPlaying();
        }
    }, [isPlaying]);
    
    useEffect(() => {
        StartPlaying();
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