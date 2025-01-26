import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import PlayButton from '../../../../ui-kit/buttons/play-button/PlayButton';
import MusicState from '../../../../../../state/entities/MusicState';

const SongsHeader = observer(({song, callback = () => {}}) => {
    return (
        <div className={styles.songInformation}>
            <div className={styles.coverWrapper}>
                <div className={styles.cover}>
                </div>
            </div>
            <div className={styles.information}>
                <div className={styles.songData}>
                    <div className={styles.songName}>
                        <span>Doesn't play</span>
                    </div>
                    <div className={styles.artist}>
                        <span>Artist — Album</span>
                    </div>
                </div>
                <div className={styles.playPanel}>
                    <PlayButton
                        isPlaying={MusicState.isPlaying} 
                        callback={() => {
                            if (callback) {
                                callback();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default SongsHeader;