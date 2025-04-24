import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import PlayButton from '../../../../ui-kit/buttons/play-button/PlayButton';
import MusicState from '../../../../../../state/entities/MusicState';
import defaultCover from '../../../../../../assets/default/song-cover.png'

const SongsHeader = observer(({isMobile, image, title, subTitle, song, callback = () => {}}) => {
    if (!song) {
        return null;
    };

    return (
        <div className={styles.songInformation}>
            <div className={styles.coverWrapper}>
                <div className={styles.cover}>
                    <img 
                        src={image ?? defaultCover}
                        draggable="false"
                        className={styles.coverImage} 
                    />
                </div>
            </div>
            <div className={styles.information}>
                <div className={styles.songData}>
                    <div className={styles.songName}>
                        <span>{title ?? "Doesn't play"}</span>
                    </div>
                    <div className={styles.artist}>
                        <span>{subTitle ?? "Artist — Album"}</span>
                    </div>
                </div>
                <div className={styles.playPanel}>
                    <PlayButton
                        isPlaying={MusicState.isPlaying} 
                        callback={() => {
                            if (callback) {
                                callback();
                            };
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default SongsHeader;