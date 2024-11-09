import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import { observer } from 'mobx-react-lite';
import { GetSongData, GetSongName } from '../../../../widgets/navigation-panel/NavigationPanel';
import musicState from '../../../../../../states/music-state';

const SongHeader = observer(({song, callback}) => {
    return (
        <div className={styles.songInformation}>
            <div className={styles.coverWrapper}>
                <div className={styles.cover}>
                    <img 
                        className={styles.coverImage}
                        src={song && song.fileAsBytes ? `data:image/png;base64,${song.fileAsBytes}` : defaultCover} 
                        draggable="false"
                    />
                </div>
            </div>
            <div className={styles.information}>
                <div className={styles.artist}>
                    <span>{GetSongData(song)}</span>
                </div>
                <div className={styles.songName}>
                    <span>{GetSongName(song)}</span>
                </div>
                <div className={styles.playPanel}>
                    <PlayButton 
                        isPlaying={musicState.isPlaying} 
                        callback={() => {
                            if (callback) {
                                callback();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
});

export default SongHeader;