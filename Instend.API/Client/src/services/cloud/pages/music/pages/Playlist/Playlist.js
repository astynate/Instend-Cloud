import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import styles from './main.module.css';
import AlbumView from '../../../../widgets/album-view/AlbumView';
import galleryState from '../../../../../../state/entities/GalleryState';
import Scroll from '../../../../widgets/scroll/Scroll';
import AddInMusic from '../../widgets/add-in-music/AddInMusic';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import SongList from '../../widgets/song-list/SongList';

const Playlist = observer(({scroll, isMobile}) => {
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
                isMobile={isMobile}
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