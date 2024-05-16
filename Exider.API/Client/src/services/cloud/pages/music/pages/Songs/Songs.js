import React from 'react';
import styles from './main.module.css';
import SongInformation from '../../widgets/song-information/SongInformation';
import SongList from '../../widgets/song-list/SongList';

const Songs = () => {
    return (
        <div className={styles.songs}>
            <SongInformation />
            <SongList />
        </div>
    );
}

export default Songs;