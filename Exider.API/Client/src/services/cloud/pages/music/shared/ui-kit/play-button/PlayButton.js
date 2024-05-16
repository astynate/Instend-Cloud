import React from 'react';
import styles from './main.module.css';
import playButton from './images/play-buttton.png';

const PlayButton = () => {
    return (
        <div className={styles.playButton}>
            <img src={playButton} draggable="false" />
        </div>
    );
}

export default PlayButton;