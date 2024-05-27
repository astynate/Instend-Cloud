import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import AlbumView from '../../../../widgets/album-view/AlbumView';
import galleryState from '../../../../../../states/gallery-state';
import { useParams } from 'react-router-dom';
import Scroll from '../../../../widgets/scroll/Scroll';
import AddInMusic from '../../widgets/add-in-music/AddInMusic';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import { observer } from 'mobx-react-lite';
import Song from '../../shared/song/Song';
import musicState from '../../../../../../states/music-state';
import SongList from '../../widgets/song-list/SongList';
import { toJS } from 'mobx';

const Playlist = observer(({scroll}) => {
    const params = useParams();
    const { albums } = galleryState;

    useEffect(() => {
        const fetchAlbums = async () => {
            await galleryState.GetPlaylists();
        }

        fetchAlbums();
    }, []);

    return (
        <>
            <AlbumView 
                isSquareCover={true}
                uniqItems={[
                    {'title': "Music", 'component': 
                    <div className={styles.contentWrapper} >
                        <div className={styles.content}>
                            <AddInMusic id={params.id} /> 
                            {!albums[params.id] || !albums[params.id].photos || albums[params.id].photos.length === 0 ?
                                <div className={styles.noImages}>
                                    <Placeholder title="No music uploaded" />
                                </div>  
                            :
                                <>
                                    <SongList 
                                        isHeaderless={true}
                                        songs={toJS(galleryState.albums[params.id].photos)}
                                    />
                                </>
                            }
                            {galleryState.albums[params.id] &&
                                <Scroll
                                    scroll={scroll}
                                    isHasMore={galleryState.albums[params.id].hasMore}
                                    count={galleryState.albums[params.id].photos.length}
                                    callback={async () => {
                                        await galleryState.GetAlbumPhotos(params.id);
                                    }}
                                />
                            }
                        </div>
                    </div>
                    }
                ]}
                button={
                    <PlayButton 
                        callback={() => alert('!')}
                    />
                }
            />
        </>
    )
});

export default Playlist;