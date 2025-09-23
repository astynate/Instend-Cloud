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
import AddInSongs from './add-in-songs-button/AddInSongs';
import SongsInformationHeader from '../../widgets/songs-information-header/SongsInformationHeader';
import { ConvertFullDate } from '../../../../../../handlers/DateHandler';
import FetchItemsWithPlaceholder from '../../../../shared/fetch/fetch-items-with-placeholder/FetchItemsWithPlaceholder';

const Songs = observer(({isMobile = false}) => {
    const { SetSongQueue, ChangePlayingState, GetCurrentSongData } = MusicState;
    let songs = StorageState.GetSelectionByType(GlobalContext.supportedMusicTypes);
    let song = GetCurrentSongData();

    useEffect(() => {
        
    }, [songs.length]);

    return (
        <SubContentWrapper>
            {isMobile === false && <SongsHeader 
                title={song ? song.name : null}
                song={song ? ConvertFullDate(song.creationTime) : null}
                callback={() => {
                    SetSongQueue(songs);
                    ChangePlayingState();
                }}
            />}
            <AddInSongs />
            {isMobile === false && <SongsInformationHeader />}
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
            <FetchItemsWithPlaceholder
                item={
                    <div></div>
                }
                isHasMore={StorageState.isHasMoreSongs}
                callback={async () => {
                    await FilesController.GetLastFilesWithType(
                        5, 
                        songs.length, 
                        'music',
                        (files) => StorageState.OnGetFilesByTypeSuccess(files, 'music')
                    );
                }}
            />
        </SubContentWrapper>
    );
});

export default Songs;