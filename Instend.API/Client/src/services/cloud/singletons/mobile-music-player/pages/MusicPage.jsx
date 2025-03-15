import { formatTimeInSecond } from '../../../../../handlers/TimeHandler';
import MusicState from '../../../../../state/entities/MusicState';
import songCover from '../../../../../assets/default/song-cover.png';
import styles from '../main.module.css';
import next from '../images/next.png';
import play from '../images/play.png';
import pause from '../images/pause.png';
import { observer } from 'mobx-react-lite';
import SimpleRange from '../../../ui-kit/ranges/simple-range/SimpleRange';

const MusicPage = observer(({ song }) => {
    const { isPlaying, time, duration, loadPercentage } = MusicState;
    const { ChangePlayingState, TurnOnNextSong, setTime, TurnOnPreviousSong } = MusicState;

    if (!song) {
        return null;
    };

    return (
        <>
            <div className={styles.bigCover}>
                <img src={songCover} draggable="false" className={styles.coverImage} />
                <img src={songCover} draggable="false" className={styles.coverImage} />
                <img src={songCover} draggable="false" className={styles.coverImage} />
                <img src={songCover} draggable="false" className={styles.coverImage} />
                <img src={songCover} draggable="false" className={styles.coverImage} />
                <img src={songCover} draggable="false" className={styles.coverImage} />
            </div>
            <h1 className={styles.bigSongName}>{song.name}</h1>
            <span className={styles.bigSongAlbum}>{song.album} - {song.artist}</span>
            <div className={styles.range}>
                <SimpleRange
                    step={1}
                    minValue={0}
                    maxValue={duration ? duration : 100}
                    value={time} 
                    setValue={setTime} 
                    loadPercentage={loadPercentage} 
                    isActive={true}
                />
            </div>
            <div className={styles.bigTime}>
                <span>{formatTimeInSecond(time)}</span>
                <span>{duration ? formatTimeInSecond(duration) :  '--:--'}</span>
            </div>
            <div className={styles.controls}>
                <div className={styles.bigButton} onClick={() => TurnOnPreviousSong()}>
                    <img src={next} draggable="false" />
                </div>
                <div className={styles.bigButton} onClick={() => ChangePlayingState()}>
                    <img src={isPlaying ? pause : play} draggable="false" />
                </div>
                <div className={styles.bigButton} onClick={() => TurnOnNextSong()}>
                    <img src={next} draggable="false" />
                </div>
            </div>
        </>
    );
});

export default MusicPage;