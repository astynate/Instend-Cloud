import React, { useEffect } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import Album from '../../widgets/album/Album';
import { toJS } from 'mobx';

const Albums = observer(() => {
    useEffect(() => {        
        galleryState.GetAlbums();
    }, []);

    return (
        <div className={styles.content}>
            {Object.entries(galleryState.albums).map(([key, value]) => {
                    return (
                        <Album key={key} album={value} />
                    )
                })
            }
        </div>
    );
});

export default Albums;