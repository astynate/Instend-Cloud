import React from 'react';
import styles from './main.module.css';
import SongInformation from '../../widgets/song-information/SongInformation';
import SongList from '../../widgets/song-list/SongList';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import Scroll from '../../../../widgets/scroll/Scroll';
import { observer } from 'mobx-react-lite';

const Songs = observer((props) => {
    return (
        <div className={styles.songs}>
            <SongInformation />
            <SongList songs={storageState.GetSelectionByType(FileAPI.musicTypes)} />
            <Scroll
                scroll={props.scroll}
                isHasMore={storageState.hasMoreSongs}
                count={storageState.countSongs}
                callback={() => {
                    storageState.GetItems(storageState.hasMoreSongs, storageState.countSongs, "music");
                }}
            />
        </div>
    );
});

export default Songs;