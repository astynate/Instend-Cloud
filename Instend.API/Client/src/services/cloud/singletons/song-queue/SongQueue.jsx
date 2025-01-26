import { observer } from 'mobx-react-lite';
import { formatTimeInSecond } from '../../../../utils/TimeHandler';
import SimpleRange from '../../ui-kit/ranges/simple-range/SimpleRange';
import styles from './main.module.css';
import play from './images/play.png';
import pause from './images/pause.png';
import next from './images/next.png';
import repeat from './images/repeat.png';
import sound from './images/sound.png';
import MusicState from '../../../../state/entities/MusicState';
import Song from '../../components/song/Song';

const SongQueue = observer(() => {
    const { songQueue, isPlaying, ChangePlayingState, GetCurrentSongData } = MusicState;
    const { time, duration, loadPercentage, SetSongQueue, setTime } = MusicState;

    let song = GetCurrentSongData();

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>Songs queue</h1>
                <span onClick={() => SetSongQueue([])}>Clear</span>
            </div>
            <div className={styles.songs}>
                {songQueue.map(song => {
                    return (
                        <Song 
                            key={song.id}
                            song={song} 
                        />
                    )
                })}
            </div>
            <div className={styles.control}>
                <div className={styles.top}>
                    <div className={styles.informationWrapper}>
                        <div className={styles.songCover}>

                        </div>
                        <div className={styles.information}>
                            <span className={styles.title}>{song.name}</span>
                            <span className={styles.artist}>{song.artist} — {song.album}</span>
                        </div>
                    </div>
                    <div className={styles.range}>
                        <span>{formatTimeInSecond(time)}</span>
                            <SimpleRange 
                                step={1}
                                minValue={0}
                                maxValue={duration ? duration : 100}
                                value={time} 
                                setValue={setTime} 
                                loadPercentage={loadPercentage} 
                                isActive={true}
                            />
                        <span>{duration ? formatTimeInSecond(duration) :  '--:--'}</span>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.controlButtons}>
                        <div className={styles.left}>
                            <img 
                                className={styles.button} 
                                src={sound} 
                                draggable="false" 
                            />
                        </div>
                        <div className={styles.center}>
                            <img 
                                className={styles.button} 
                                src={next} 
                                draggable="false" 
                            />
                            <img 
                                className={styles.button} 
                                src={isPlaying ? pause : play} 
                                draggable="false" 
                                onClick={() => ChangePlayingState()}
                            />
                            <img 
                                className={styles.button} 
                                src={next} 
                                draggable="false" 
                            />
                        </div>
                        <div className={styles.right}>
                            <img 
                                className={styles.button} 
                                src={repeat} 
                                draggable="false" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SongQueue;