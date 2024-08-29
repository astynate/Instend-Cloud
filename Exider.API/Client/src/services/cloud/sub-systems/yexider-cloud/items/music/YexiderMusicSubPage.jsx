import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import SongList from '../../../../pages/music/widgets/song-list/SongList';
import styles from './main.module.css';

const YexiderMusicSubPage = () => {
    let songs = storageState.GetSelectionByType(FileAPI.musicTypes);

    return (
        <div className={styles.wrapper}>
            <SongList
                songs={songs} 
                isMobile={true}
                isHeaderless={true}
                isHasIndex={false}
            />
        </div>
    );
}

export default YexiderMusicSubPage;