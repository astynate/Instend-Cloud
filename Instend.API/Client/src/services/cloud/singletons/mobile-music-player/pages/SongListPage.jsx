import MusicState from '../../../../../state/entities/MusicState';
import Song from '../../../components/song/Song';
import styles from '../main.module.css';

const SongListPage = () => {
    const { songQueue } = MusicState;

    return (
        <div className={styles.wrapper}>
            {songQueue.map(song => {
                return (
                    <Song
                        key={song.id}
                        song={song} 
                    />
                )
            })}
        </div>
    );
};

export default SongListPage;