import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import SongCover from '../../components/song-cover/SongCover';
import MusicState from '../../../../state/entities/MusicState';

const MobileMusicPlayer = observer(() => {
    const { isPlaying, GetCurrentSongData, IsSongIsPlaying } = MusicState;
    let song = GetCurrentSongData();

    if (!isPlaying) {
        return null;
    };

    if (!song) {
        return null;
    };

    return (
        <div className={styles.player}>
            <div>
                <div className={styles.cover}>
                    <SongCover 
                        song={song} 
                        isPlaying={IsSongIsPlaying(song.id)}
                    />
                </div>
            </div>
        </div>
    );
});

export default MobileMusicPlayer;