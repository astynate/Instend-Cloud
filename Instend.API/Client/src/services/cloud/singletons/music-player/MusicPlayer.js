import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { convertSecondsToTicks, convertTicksToSeconds } from '../../../../handlers/TimeHandler';
import styles from './main.module.css';
import MusicState from '../../../../state/entities/MusicState';

const MusicPlayer = observer(() => {
    const [isAvailable, setAvailableState] = useState(true);
    const audioRef = useRef(null);

    const { isPlaying, songQueue, currentSongIndex, TurnOnNextSong, setProgress } = MusicState;
    const { setDuration } = MusicState;

    const ChangePlayingState = (state) => {
        if (isAvailable && audioRef.current) {
            let playPromise = state ? audioRef.current.play() : 
                audioRef.current.pause();

            setAvailableState(false);
         
            if (playPromise !== undefined) {
                playPromise.
                    then(_ => {
                        setAvailableState(true);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                return;
            }

            setAvailableState(true);
        };
    };

    const handleTimeUpdate = () => {
        MusicState.setTime(audioRef.current.currentTime);
    };

    const handleProgress = () => {
        const audio = audioRef.current;

        if (audio.duration) {
            setDuration(audio.duration);
        }
        
        if (audio && audio.buffered.length > 0) {
            const loaded = audio.buffered.end(audio.buffered.length - 1);
            const total = audio.duration;
            const loadedPercentage = (loaded / total) * 100;
            
            setProgress(loadedPercentage);
        }
    };

    const isTimeInRange = (value, target, step) => {
        return (value + step) < target || (value - step) > target;
    }

    useEffect(() => {
        const audio = audioRef.current;
        const newTime = MusicState.time;

        if (audio && audio.currentTime >= audio.duration) {
            TurnOnNextSong();
            audio.currentTime = 0;

            if (MusicState.repeatState === 2)
                ChangePlayingState(true);
            
            return;
        }
        
        if (audio && isTimeInRange(audio.currentTime, newTime, 5)) {
            audio.currentTime = newTime;
        }
    }, [MusicState.time]);

    useEffect(() => {
        ChangePlayingState(isPlaying);
    }, [isPlaying, songQueue, currentSongIndex]);

    return (
        songQueue.length > 0 &&
            <audio 
                key={songQueue[currentSongIndex].id}
                ref={audioRef} 
                className={styles.player} 
                controls 
                onTimeUpdate={handleTimeUpdate}
                onProgress={handleProgress}
            >
                <source src={`${process.env.REACT_APP_SERVER_URL}/api/storage/stream?path=${songQueue[currentSongIndex].path}`} />
            </audio>
    );
});

export default MusicPlayer;