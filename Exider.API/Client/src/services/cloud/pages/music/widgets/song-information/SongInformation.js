import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import BurgerMenu from '../../../../shared/ui-kit/burger-menu/BurgerMenu';
import { observer } from 'mobx-react-lite';
import { GetSongData, GetSongName } from '../../../../widgets/navigation-panel/NavigationPanel';
import musicState from '../../../../../../states/music-state';

const SongInformation = observer(({song}) => {
    return (
        <div className={styles.songInformation}>
            <div className={styles.coverWrapper}>
                <div className={styles.effect}>
                    {/* {props.cover ? 
                            <>
                            </>
                        :
                            <img 
                                className={styles.coverImage}
                                src={defaultCover} 
                                draggable="false"
                            />
                        } */}
                </div>
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
                        callback={() => musicState.ChangePlayingState()}
                    />
                    <BurgerMenu 
                        items={[
                            {'title': "I love Astynate =)", callback: () => alert('I Love ASYNATE))))')}
                        ]}
                    />
                </div>
            </div>
        </div>
    )
});

export default SongInformation;