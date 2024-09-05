import React, { useRef, useState } from 'react';
import styles from './main.module.css';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../states/gallery-state';
import Loader from '../../shared/loader/Loader';
import { ConvertDate } from '../../../../utils/DateHandler';
import emoji from './images/emoji.png';
import BurgerMenu from '../../shared/ui-kit/burger-menu/BurgerMenu';
import UserAvatar from '../../widgets/avatars/user-avatar/UserAvatar';
import AddUser from '../../widgets/avatars/add-user/AddUser';
import OpenAccessProcess from '../../process/open-access/OpenAccessProcess';
import LocalMenu from '../../shared/ui-kit/local-menu/LocalMenu';
import Comments from '../../widgets/social/comments/Comments';
import { DeleteComment } from '../../pages/gallery/api/AlbumRequests';
import HeaderSearch from './compontens/header-search/HeaderSearch';
import MainContentWrapper from '../../features/main-content-wrapper/MainContentWrapper';
import { AddUploadingAlbumComment } from '../../api/CommentAPI';
import applicationState from '../../../../states/application-state';

const AlbumView = observer(({isSquareCover, button, uniqItems, views, isMobile}) => {
    const { albums } = galleryState;
    const params = useParams();
    const wrapper = useRef();
    const [isUsersLoading, setUsersLoadingState] = useState(true);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);

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
                                        {applicationState.isMobile === false && button && (button)}
                                        {/* <img
                                            src={emoji}
                                            className={styles.subButton} 
                                        /> */}
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
                                            <div className={styles.buttons}>
                                                {applicationState.isMobile === true && button && (button)}   
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
                                    fetch_callback={() => galleryState.GetAlbumComments(params.id)}
                                    comments={galleryState.albums[params.id].comments ? 
                                        galleryState.albums[params.id].comments : []}
                                    id={params.id}
                                    setUploadingComment={(comment, images, user, id) => 
                                        AddUploadingAlbumComment(
                                            '/api/album-comments', 
                                            comment, 
                                            images, 
                                            user, 
                                            id, 
                                            galleryState.albums[params.id].comments,
                                            (comments) => galleryState.SetComments.bind(galleryState)(params.id, comments),
                                            galleryState.albumCommentQueueId,
                                            galleryState.SetCommentQueueId.bind(galleryState)
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

export default AlbumView;