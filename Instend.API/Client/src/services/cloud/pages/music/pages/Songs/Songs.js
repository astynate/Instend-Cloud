import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import StorageState from '../../../../../../state/entities/StorageState';
import GlobalContext from '../../../../../../global/GlobalContext';
import SongsHeader from '../../widgets/songs-header/SongsHeader';
import SubContentWrapper from '../../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import FilesController from '../../../../api/FilesController';
import Song from '../../../../components/song/Song';
import MusicState from '../../../../../../state/entities/MusicState';

const Songs = observer(({}) => {
    const { SetSongQueue, ChangePlayingState, GetCurrentSongData } = MusicState;

    let songs = StorageState.GetSelectionByType(GlobalContext.supportedMusicTypes);
    let song = GetCurrentSongData();

    useEffect(() => {
        FilesController.GetLastFilesWithType(
            5, 
            songs.length, 
            'music',
            StorageState.OnGetFilesByTypeSuccess
        );
    }, [songs.length]);

    return (
        <SubContentWrapper>
            <SongsHeader 
                song={song}
                callback={() => {
                    SetSongQueue(songs);
                    ChangePlayingState();
                }}
            />
            <div className={styles.songListHeader}>
                <div className={styles.name}>
                    <span className={styles.item}>#</span>
                    <span className={styles.item}>Name</span>
                </div>
                <span className={styles.item}>Album</span>
                <span className={styles.item}>Date</span>
                <span className={styles.item}>Time</span>
            </div>
            <div className={styles.songs}>
                {songs.map((song, index) => {
                    return (
                        <Song
                            key={song.id} 
                            index={index + 1}
                            song={song}
                            setQueue={() => SetSongQueue(songs)}
                        />
                    )
                })}
            </div>
        </SubContentWrapper>
    );
});

export default Songs;