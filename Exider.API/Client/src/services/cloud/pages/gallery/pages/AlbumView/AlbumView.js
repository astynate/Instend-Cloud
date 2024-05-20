import React, { useEffect, useRef, useState } from 'react';
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
import AddUser from '../../../../widgets/avatars/add-user/AddUser';
import LocalMenu from '../../../../shared/ui-kit/local-menu/LocalMenu';
import Comments from '../../../../widgets/social/comments/Comments';
import Button from '../../../../shared/ui-kit/button/Button';
import OpenAccessProcess from '../../../../process/open-access/OpenAccessProcess';
import { DeleteComment } from '../../api/AlbumRequests';

const AlbumView = observer((props) => {
    const { albums } = galleryState;
    const params = useParams();
    const wrapper = useRef();
    const [isUsersLoading, setUsersLoadingState] = useState(true);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);

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

    const accessSaveCallback = (data) => {
        if (data) {
            galleryState.SetAlbumAccess(data, params.id);
        }
    }

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
                            {isUsersLoading ? 
                                <>
                                    <div className={styles.avatarPlaceholder}></div>
                                    <div className={styles.avatarPlaceholder}></div>
                                    <div className={styles.avatarPlaceholder}></div>
                                </>
                            : 
                                <>
                                    {galleryState.albums && galleryState.albums[params.id] && galleryState.albums[params.id].users && galleryState.albums[params.id].users.map
                                        && galleryState.albums[params.id].users.map((element, index) => {
                                            if (element.user) {
                                                let user = element.user;
                                                user.avatar = element.base64Avatar;
                                            
                                                return (
                                                    <UserAvatar key={index} user={user} />
                                                )
                                            } else {
                                                return null;
                                            }
                                        })
                                    }
                                    <AddUser callback={() => setOpenAccessWindowState(true)} />   
                                </>
                            }
                        </div>
                    </div>
                    <OpenAccessProcess
                        id={params.id}
                        open={isOpenAccessWindow}
                        close={() => setOpenAccessWindowState(false)}
                        setLoadingState={setUsersLoadingState}
                        endPoint={'api/album-access'}
                        accessSaveCallback={accessSaveCallback}
                    />
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
                                                    count={galleryState.albums[params.id].photos.length}
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
                                        <Comments 
                                            fetch_callback={() => galleryState.GetAlbumComments(params.id)}
                                            comments={galleryState.albums[params.id].comments ? 
                                                galleryState.albums[params.id].comments : []}
                                            id={params.id}
                                            setUploadingComment={galleryState.AddUploadingAlbumComment.bind(galleryState)}
                                            deleteCallback={(id) => DeleteComment(id, params.id)}
                                        />
                                    </div>
                                </>
                            }
                        ]}
                        default={0}
                    />
                </>
            }
        </div>
    );
});

export default AlbumView;