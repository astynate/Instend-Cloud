import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import SongsHeader from '../../widgets/songs-header/SongsHeader';
import Song from '../../../../components/song/Song';
import styles from './main.module.css';
import MusicState from '../../../../../../state/entities/MusicState';
import AlbumsController from '../../../../api/AlbumsController';
import StorageController from '../../../../../../api/StorageController';
import { ConvertFullDate } from '../../../../../../handlers/DateHandler';
import AddInSongs from '../songs/add-in-songs-button/AddInSongs';
import SubContentWrapper from '../../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import SongsInformationHeader from '../../widgets/songs-information-header/SongsInformationHeader';

const Playlist = observer(({ isMobile }) => {
    const params = useParams();
    const [playlist, setPlaylist] = useState(undefined);
    const [isHasMore, setHasMoreState] = useState(true);
    const { SetSongQueue } = MusicState;

    useEffect(() => {
        if (!params || !params.id) {
            return;
        };

        if (!isHasMore) {
            return;
        };

        AlbumsController.GetAlbum(
            params.id, 
            playlist?.files?.length, 
            5, 
            (data) => AlbumsController.GetAlbumDefaultCallback(data, playlist, setPlaylist, params, setHasMoreState)
        );
    }, [params.id, playlist, isHasMore]);

    if (!playlist) {
        return null;
    };

    return (
        <SubContentWrapper>
            <AddInSongs />
            <SongsHeader
                isMobile={isMobile}
                image={StorageController.getFullFileURL(playlist.cover)}
                title={playlist.name}
                subTitle={ConvertFullDate(playlist.creationTime)}
                song={{}}
                callback={() => {

                }}
            />
            {isMobile=== false && <SongsInformationHeader />}
            <div className={styles.songs}>
                {playlist.files.map((song, index) => {
                    return (
                        <Song
                            key={song.id} 
                            index={index + 1}
                            song={song}
                            setQueue={() => SetSongQueue(playlist.files)}
                        />
                    )
                })}
            </div>
        </SubContentWrapper>
    );
});

export default Playlist;