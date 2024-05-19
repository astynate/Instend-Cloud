import React from 'react';
import styles from './main.module.css';
import SongInformation from '../../widgets/song-information/SongInformation';
import SongList from '../../widgets/song-list/SongList';
import storageState from '../../../../../../states/storage-state';
import FileAPI from '../../../../api/FileAPI';

const Songs = () => {
    return (
        <div className={styles.songs}>
            <SongInformation />
            <SongList songs={storageState.GetSelectionByType(FileAPI.musicTypes)} />
        </div>
    );
}

export default Songs;