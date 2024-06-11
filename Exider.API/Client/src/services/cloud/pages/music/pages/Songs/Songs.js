import React, { useContext, useEffect, useState } from 'react';
import styles from './main.module.css';
import SongInformation from '../../widgets/song-information/SongInformation';
import SongList from '../../widgets/song-list/SongList';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';
import Scroll from '../../../../widgets/scroll/Scroll';
import { observer } from 'mobx-react-lite';
import { layoutContext } from '../../../../layout/Layout';
import AddInMusic from '../../widgets/add-in-music/AddInMusic';
import musicState from '../../../../../../states/music-state';

const Songs = observer((props) => {
    const { song } = useContext(layoutContext);
    let songs = storageState.GetSelectionByType(FileAPI.musicTypes);

    return (
        <div className={styles.songs}>
            <SongInformation 
                song={song}
                callback={() => {
                    if (songs.length > 0 && musicState.songQueue.length === 0) {
                        musicState.SetSongQueue(songs);
                        musicState.SetCurrentSongIndex(0);
                    } else if (musicState.songQueue.length > 0) {
                        musicState.ChangePlayingState();
                    }
                }}
            />
            <SongList 
                songs={songs} 
            />
            <Scroll
                scroll={props.scroll}
                isHasMore={storageState.hasMoreSongs}
                count={storageState.countSongs}
                callback={() => {
                    storageState.GetItems(storageState.hasMoreSongs, storageState.countSongs, "music");
                }}
            />
            <AddInMusic />
        </div>
    );
});

export default Songs;