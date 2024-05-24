import React from 'react';
import styles from './main.module.css';
import PlayListPreview from '../../widgets/playlist-preview/PlayListPreview';
import AddInMusic from '../../widgets/add-in-music/AddInMusic';

const Playlists = () => {
    return (
        <div className={styles.content}>
            <AddInMusic />
            {Array.from({length: 10}).map((_, index) => {
                return (
                    <PlayListPreview 
                        key={index}
                    />
                );
            })}
        </div>
    );
 };

export default Playlists;