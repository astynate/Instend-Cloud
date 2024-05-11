import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import Scroll from '../../../../widgets/scroll/Scroll';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import Loader from '../../../../shared/loader/Loader';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';
import PhotoList from '../../shared/photo-list/PhotoList';
import Add from '../../widgets/add/Add';
import UserAvatar from '../../../../widgets/avatars/user-avatar/UserAvatar';
import userState from '../../../../../../states/user-state';
import AddUser from '../../../../widgets/avatars/add-user/AddUser';
import LocalMenu from '../../../../shared/ui-kit/local-menu/LocalMenu';
import Comments from '../../../../widgets/social/comments/Comments';
import Button from '../../../../shared/ui-kit/button/Button';

const AlbumView = observer((props) => {
    const { albums } = galleryState;
    const params = useParams();
    const wrapper = useRef();

    useEffect(() => {
        const fetchAlbums = async () => {
            await galleryState.GetAlbums(); 
            await galleryState.GetAlbumPhotos(params.id);
        };

        fetchAlbums();
    }, []);

    useEffect(() => {
        props.setAlbumId(params.id);
    }, [params]);

    return (
        <div className={styles.album}>
            {!albums[params.id] ?
                <div className={styles.albumPlaceholder}>
                    <Loader />
                </div>
            : 
                <>
                    <div className={styles.header}>
                        <div className={styles.information}>
                            <img 
                                src={`data:image/png;base64,${albums[params.id].cover}`} 
                                className={styles.cover}
                                draggable="false"
                            />
                            <div className={styles.control}>
                                <div className={styles.nameWrapper}>
                                    <h1 className={styles.albumName}>{albums[params.id].name}</h1>
                                    <span className={styles.albumDate}>{ConvertFullDate(albums[params.id].creationTime)}</span>
                                </div>
                                {albums[params.id].description && <div className={styles.descriptionWrapper}>
                                    <span className={styles.descritpion}>{albums[params.id].description}</span>
                                </div>}
                                <div className={styles.people}>
                                    <Button value="Follow" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.addition}>
                            <UserAvatar avatar={userState.user.avatar} />
                            <AddUser callback={() => alert('!')} />     
                        </div>
                    </div>
                    <div>
                        <LocalMenu 
                            items={[
                                {'title': "Photos", 'component': 
                                    <>
                                        <div className={styles.content}>
                                            <Add id={params.id} />
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
                                                        forwardRef={wrapper}
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
                                },
                                {'title': "Comments", "component": 
                                    <>
                                        <div className={styles.content}>
                                            <Comments />
                                        </div>
                                    </>
                                }
                            ]}
                            default={0}
                        />
                    </div>
                </>
            }
        </div>
    );
});

export default AlbumView;