import React, { useEffect } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import Album from '../../widgets/album/Album';

const Albums = observer(() => {
    useEffect(() => {        
        galleryState.GetAlbums();
    }, []);

    return (
        <div className={styles.content}>
            {galleryState.albums.map(element => {
                return (
                    <Album key={element.id} album={element} />
                )
            })}
        </div>
    );
});

export default Albums;