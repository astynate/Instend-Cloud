import React from 'react';
import styles from './main.module.css';
import playButton from './images/play-buttton.png';
import pause from './images/pause.png';

const PlayButton = ({isPlaying, callback}) => {
    return (
        <div className={styles.playButton} onClick={() => callback()}>
            <img src={isPlaying ? pause : playButton} draggable="false" />
        </div>
    );
}

export default PlayButton;