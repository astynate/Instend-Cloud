import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { DeleteComment } from '../../pages/gallery/api/AlbumRequests';
import { ConvertDate } from '../../../../utils/DateHandler';
import { AddUploadingAlbumComment } from '../../api/CommentAPI';
import styles from './main.module.css';
import GalleryState from '../../../../state/entities/GalleryState';
import Loader from '../../shared/loader/Loader';
import BurgerMenu from '../../shared/ui-kit/burger-menu/BurgerMenu';
import UserAvatar from '../../widgets/avatars/user-avatar/UserAvatar';
import AddUser from '../../widgets/avatars/add-user/AddUser';
import OpenAccessProcess from '../../process/open-access/OpenAccessProcess';
import LocalMenu from '../../shared/ui-kit/local-menu/LocalMenu';
import Comments from '../../widgets/social/comments/Comments';
import HeaderSearch from './compontens/header-search/HeaderSearch';
import MainContentWrapper from '../../features/main-content-wrapper/MainContentWrapper';
import ApplicationState from '../../../../state/application/ApplicationState';

const AlbumViewTemplate = observer(({isSquareCover, button, uniqItems, views, isMobile}) => {
    const { albums } = GalleryState;
    const [isUsersLoading, setUsersLoadingState] = useState(true);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);
    const params = useParams();

    const accessSaveCallback = (data) => {
        if (!!data === true)
            GalleryState.SetAlbumAccess(data, params.id);
    }

    return (
        <div className={styles.album}>
            {!albums[params.id] ?
                <div className={styles.albumPlaceholder}>
                    <Loader />
                </div>
            : 
                <>
                    <MainContentWrapper>
                        <div className={styles.header}>
                            <div className={styles.information}>
                                <img 
                                    src={`data:image/png;base64,${albums[params.id].cover}`} 
                                    className={styles.cover}
                                    draggable="false"
                                    id={isSquareCover ? 'square' : null}
                                />
                                <div className={styles.control}>
                                    <div className={styles.nameWrapper}>
                                        <span className={styles.albumDate}>{ConvertDate(albums[params.id].creationTime)}</span>
                                        <h1 className={styles.albumName}>{albums[params.id].name}</h1>
                                    </div>
                                    {albums[params.id].description && 
                                        <div className={styles.descriptionWrapper}>
                                            <span className={styles.descritpion}>
                                                <span className={styles.views}>{views ? views : 0}</span> Views
                                            </span>
                                            <span className={styles.descritpion}>{albums[params.id].description}</span>
                                        </div>
                                    }
                                    <div className={styles.controlPanel}>
                                        {ApplicationState.isMobile === false && button && (button)}
                                        <BurgerMenu 
                                            items={[
                                                {title: "astynate", callback: () => {}}
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.addition}>
                                <div className={styles.users}>
                                    {isUsersLoading ? 
                                        <>
                                            <div className={styles.avatarPlaceholder}></div>
                                            <div className={styles.avatarPlaceholder}></div>
                                            <div className={styles.avatarPlaceholder}></div>
                                        </>
                                    : 
                                        <>
                                            {GalleryState.albums && GalleryState.albums[params.id] && GalleryState.albums[params.id].users && GalleryState.albums[params.id].users.map
                                                && GalleryState.albums[params.id].users.map((element, index) => {
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
                                            <div className={styles.buttons}>
                                                {ApplicationState.isMobile === true && button && (button)}   
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </MainContentWrapper>
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
                            ...uniqItems,
                            {'title': "Comments", "component": 
                                <Comments 
                                    fetch_callback={() => GalleryState.GetAlbumComments(params.id)}
                                    comments={GalleryState.albums[params.id].comments ? 
                                        GalleryState.albums[params.id].comments : []}
                                    id={params.id}
                                    setUploadingComment={(comment, images, user, id) => 
                                        AddUploadingAlbumComment(
                                            '/api/album-comments', 
                                            comment, 
                                            images, 
                                            user, 
                                            id, 
                                            GalleryState.albums[params.id].comments,
                                            (comments) => GalleryState.SetComments.bind(GalleryState)(params.id, comments),
                                            GalleryState.albumCommentQueueId,
                                            GalleryState.SetCommentQueueId.bind(GalleryState)
                                        )}
                                    deleteCallback={(id) => DeleteComment(id, params.id)}
                                />
                            }
                        ]}
                        default={0}
                        rightItems={[
                            (<HeaderSearch 
                                placeholder={"Search by name"}
                            />)
                        ]}
                    />
                </>
            }
        </div>
    );
});

export default AlbumViewTemplate;