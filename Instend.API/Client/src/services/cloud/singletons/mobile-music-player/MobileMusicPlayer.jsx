import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import styles from './main.module.css';
import SongCover from '../../components/song-cover/SongCover';
import MusicState from '../../../../state/entities/MusicState';
import play from './images/play.png';
import pause from './images/pause.png';
import next from './images/next.png';
import MusicPage from './pages/MusicPage';
import music from './images/music.png';
import list from './images/list.png';
import SongListPage from './pages/SongListPage';

const MobileMusicPlayer = observer(({ image }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const { isPlaying, GetCurrentSongData, IsSongIsPlaying } = MusicState;
    const { isMusicPanelOpen, SetMusicPanelOpenState, ChangePlayingState, TurnOnNextSong } = MusicState;
    
    let song = GetCurrentSongData();

    if (isPlaying === false && isMusicPanelOpen === false) {
        return null;
    };

    if (!song) {
        return null;
    };

    return (
        <div className={styles.player} isopen={isMusicPanelOpen ? 'true' : null}>
            {isMusicPanelOpen === true && <div className={styles.songWrapper}>
                <div 
                    className={styles.close} 
                    onClick={() => SetMusicPanelOpenState(false)}
                ></div>
                {currentPageIndex === 0 && <MusicPage song={song} />}
                {currentPageIndex === 1 && <SongListPage song={song} />}
                <div className={styles.bottomPanel}>
                    <div 
                        className={styles.navigationButton} 
                        active={currentPageIndex === 0 ? 'true' : null}
                        onClick={() => setCurrentPageIndex(0)}
                    >
                        <img src={music} draggable="false" />
                    </div>
                    <div 
                        className={styles.navigationButton} 
                        active={currentPageIndex === 1 ? 'true' : null}
                        onClick={() => setCurrentPageIndex(1)}
                    >
                        <img src={list} draggable="false" />
                    </div>
                </div>
            </div>}
            {isPlaying && isMusicPanelOpen === false && 
                <div className={styles.collapsedPanel}>
                    <div className={styles.cover}>
                        <SongCover 
                            song={song} 
                            isPlaying={IsSongIsPlaying(song.id)}
                        />
                    </div>
                    <div className={styles.smallInformation} onClick={() => SetMusicPanelOpenState(true)}>
                        <h1>{song.name}</h1>
                        <span>{song.album}</span>
                    </div>
                    <div className={styles.button} onClick={() => ChangePlayingState()}>
                        <img src={isPlaying ? pause : play} draggable="false" />
                    </div>
                    <div className={styles.button} onClick={() => TurnOnNextSong()}>
                        <img src={next} draggable="false" />
                    </div>
                </div>}
        </div>
    );
});

export default MobileMusicPlayer;