import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import PlayButton from '../../ui-kit/buttons/play-button/PlayButton';
import StorageController from '../../../../api/StorageController';
import StorageItemDescription from '../../features/storage/storage-item-description/StorageItemDescription';
import MusicState from '../../../../state/entities/MusicState';
import AlbumsController from '../../api/AlbumsController';

const PlayListPreview = observer(({ playlist }) => {
    const [item, setItem] = useState(playlist);
    const [isHasMore, setHasMoreState] = useState(true);
    const [isPlay, setPlaylingState] = useState(false);
    const { isPlaying, SetSongQueue, ChangePlayingState } = MusicState;

    useEffect(() => {
        if (!isPlay)
            return;

        if (!isHasMore)
            return;

        AlbumsController.GetAlbum(
            playlist.id, 
            item?.files?.length, 
            5, 
            (data) => AlbumsController.GetAlbumDefaultCallback(data, item, setItem, playlist, setHasMoreState)
        );
    }, [playlist.id, item, isHasMore, isPlay]);

    if (!playlist) {
        return null;
    };
    
    return (
        <div className={styles.playlist} data={playlist.id}>
            <div className={styles.view}>
                <div className={styles.cover}>
                    <Link to={`/music/playlist/${playlist.id}`}>
                        <img 
                            src={StorageController.getFullFileURL(playlist.cover)} 
                            className={styles.cover}
                            draggable="false"
                        />
                    </Link>
                    <div className={styles.buttonWrapper}>
                        <PlayButton
                            isPlaying={isPlaying}
                            callback={() => {
                                if (item && item.files) {
                                    SetSongQueue(item.files);
                                };

                                setPlaylingState(true);
                                ChangePlayingState();
                            }}
                        />
                    </div>
                </div>
            </div>
            <StorageItemDescription
                name={playlist.name} 
                time={playlist.creationTime}
            />
        </div>
    );
});

export default PlayListPreview;