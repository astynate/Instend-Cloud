import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import Scroll from '../../../../widgets/sroll/Scroll';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import { toJS } from 'mobx';
import Loader from '../../../../shared/loader/Loader';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';
import PhotoList from '../../shared/photo-list/PhotoList';

const AlbumView = observer((props) => {
    const { albums } = galleryState;
    const params = useParams();

    useEffect(() => {
        const fetchAlbums = async () => {
            await galleryState.GetAlbums(); 
            await galleryState.GetAlbumPhotos(params.id, 0, 5);
        };

        fetchAlbums();
    }, []);

    return (
        <div className={styles.album}>
            {!albums[params.id] ?
                <div className={styles.albumPlaceholder}>
                    <Loader />
                </div>
            : 
                <>
                    <div className={styles.left}>
                        <div className={styles.information}>
                            <div className={styles.nameWrapper}>
                                <h1 className={styles.albumName}>{albums[params.id].name}</h1>
                                <span className={styles.albumDate}>{ConvertFullDate(albums[params.id].creationTime)}</span>
                            </div>
                            <img 
                                src={`data:image/png;base64,${albums[params.id].cover}`} 
                                className={styles.cover}
                                draggable="false"
                            />
                        </div>
                    </div>   
                    <div className={styles.right}>
                        {!albums[params.id].photos || albums[params.id].photos.length === 0 ?
                            <div className={styles.noImages}>
                                <Placeholder title="No photos uploaded" />
                            </div>              
                        :
                            <div className={styles.photosWrapper}>
                                <PhotoList 
                                    photos={galleryState.albums && galleryState.albums[params.id] && galleryState.albums[params.id].photos ? 
                                        galleryState.albums[params.id].photos : []} 
                                    scale={props.scale}
                                    photoGrid={props.photoGrid}
                                />
                                <Scroll
                                    scroll={props.scroll}
                                    isHasMore={galleryState.albums[params.id].hasMore}
                                    array={galleryState.albums[params.id].photos}
                                    callback={() => {
                                        galleryState.GetAlbumPhotos(params.id);
                                    }}
                                />
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    );
});

export default AlbumView;