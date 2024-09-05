import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import AlbumView from '../../../../widgets/album-view/AlbumView';
import galleryState from '../../../../../../states/gallery-state';
import { useParams } from 'react-router-dom';
import AddInGallery from '../../widgets/add/AddInGallery';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import Scroll from '../../../../widgets/scroll/Scroll';
import PhotoList from '../../shared/photo-list/PhotoList';

const Album = observer(({photoGrid, scale, scroll}) => {
    const { albums } = galleryState;
    const params = useParams();
    const wrapper = useRef();

    useEffect(() => {
        const fetchAlbums = async () => {
            await galleryState.GetAlbums(); 
            await galleryState.GetAlbumPhotos(params.id);
        }

        fetchAlbums();
    }, []);

    return (
        <>
            <AlbumView
                uniqItems={[
                    {'title': "Photos", 'component': 
                        <>
                            <AddInGallery id={params.id} /> 
                            {!albums[params.id] || !albums[params.id].photos || albums[params.id].photos.length === 0 ?
                                <div className={styles.noImages}>
                                    <Placeholder title="No photos uploaded" />
                                </div>
                            :
                                <PhotoList
                                    photos={galleryState.albums && galleryState.albums[params.id] && galleryState.albums[params.id].photos ? 
                                        galleryState.albums[params.id].photos : []} 
                                    scale={scale}
                                    photoGrid={photoGrid}
                                    forwardRef={wrapper}
                                />
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
                        </>
                    },
                ]}
                views={galleryState.albums[params.id] && galleryState.albums[params.id].views ? 
                    galleryState.albums[params.id].views : 0}
            />
        </>
    );
});

export default Album;