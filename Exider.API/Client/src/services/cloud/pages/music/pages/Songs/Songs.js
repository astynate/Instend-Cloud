import React from 'react';
import styles from './main.module.css';
import SongInformation from '../../widgets/song-information/SongInformation';
import SongList from '../../widgets/song-list/SongList';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';

const Songs = (props) => {
    return (
        <div className={styles.songs}>
            <SongInformation />
            <SongList songs={storageState.GetSelectionByType(FileAPI.musicTypes)} />
            <Scroll
                scroll={props.scroll}
                isHasMore={galleryState.albums[params.id].hasMore}
                count={galleryState.albums[params.id].photos.length}
                callback={() => {
                    galleryState.GetAlbumPhotos(params.id);
                }}
            />
        </div>
    );
}

export default Songs;