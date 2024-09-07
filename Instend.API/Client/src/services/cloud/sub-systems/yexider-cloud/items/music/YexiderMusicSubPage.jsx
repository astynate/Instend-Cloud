import { observer } from 'mobx-react-lite';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import SongList from '../../../../pages/music/widgets/song-list/SongList';
import Scroll from '../../../../widgets/scroll/Scroll';
import styles from './main.module.css';

const YexiderMusicSubPage = observer(({wrapper, setSelectedFiles}) => {
    let songs = storageState.GetSelectionByType(FileAPI.musicTypes);

    return (
        <div className={styles.wrapper}>
            <SongList
                songs={songs} 
                isMobile={true}
                isHeaderless={true}
                isHasIndex={false}
                setSelectedFiles={setSelectedFiles}
            />
            <Scroll
                scroll={wrapper}
                isHasMore={storageState.hasMoreSongs}
                count={storageState.countSongs}
                callback={() => {
                    storageState.GetItems(storageState.hasMoreSongs, storageState.countSongs, "music");
                }}
            />
        </div>
    );
});

export default YexiderMusicSubPage;