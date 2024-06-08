import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Header from '../../../../features/profile/header/Header';
import { instance } from '../../../../../../state/Interceptors';
import Description from '../../../../widgets/description/Description';
import HeaderSearch from '../../../../widgets/album-view/compontens/header-search/HeaderSearch';
import LocalMenu from '../../../../shared/ui-kit/local-menu/LocalMenu';
import { useNavigate, useParams } from 'react-router-dom';
import userState from '../../../../../../states/user-state';
import CommunityEditor from '../../../../features/add-community-pop-up/CommunityEditor';
import applicationState from '../../../../../../states/application-state';
import Comments from '../../../../widgets/social/comments/Comments';
import { AddUploadingAlbumComment } from '../../../../api/CommentAPI';
import galleryState from '../../../../../../states/gallery-state';
import { WaitingForConnection, galleryWSContext } from '../../../../layout/Layout';

const Community = ({isMobile}) => {
    const [isLoading, setLoadingState] = useState(true);
    const [community, setCommunity] = useState(null);
    const [publications, setPublications] = useState([]);
    const [publicationQueueId, setPublicationQueueId] = useState(0);
    const [isOwner, setIsOwnerState] = useState(false);
    const [isCommunityEditorOpen, setCommunityEditorState] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    galleryWSContext.useSignalREffect(
        "ReceivePublications",
        (comments) => {
            if (comments && comments.length > 0) {
                setPublications(comments);
            }
        }
    );

    galleryWSContext.useSignalREffect(
        "AddPublication",
        ({comment, user, albumId, queueId}) => {
            comment = {comment: comment, user: user};

            if (comment && albumId === params.id) {
                setPublications(prev => prev.map(element => {
                    if (element.queueId === queueId){
                        element = comment;
                    }
    
                    return element;
                }));
            }
        }
    );

    galleryWSContext.useSignalREffect(
        "DeletePublication",
        (id) => {
            setPublications(prev =>{
                return prev.filter(element => element.comment.id !== id);
            })
        }
    );

    const UpdateCommunity = async (id, name, description, avatar, header) => {
        let form = new FormData();
    
        form.append('id', id);
        form.append('name', name);
        form.append('description', description);
        form.append('avatar', avatar);
        form.append('header', header);
        
        await instance.put('/api/community', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response.status === 200 && response.data && response.data.ownerId) {
                setIsOwnerState(response.data.ownerId === userState.user.id);
                setCommunity(response.data);
                setLoadingState(false);
            } else {
                setTimeout(() => navigate('/'), 1000);
            }
        })
        .catch(error => {
            applicationState.AddErrorInQueue('Attention!', error.response.data);
        });
    }

    useEffect(() => {
        if (params.id) {
            (async () => {
                await instance
                    .get(`/api/community/single?id=${params.id}`)
                    .then((response) => {
                        if (response.status === 200 && response.data && response.data.ownerId) {
                            setIsOwnerState(response.data.ownerId === userState.user.id);
                            setCommunity(response.data);
                            setLoadingState(false);
                        } else {
                            setTimeout(() => navigate('/'), 1000);
                        }
                    })
                    .catch(() => {
                        setTimeout(() => navigate('/'), 1000);
                    });

                await WaitingForConnection(galleryWSContext);

                if (galleryWSContext.connection.state === 'Connected') {
                    await galleryWSContext.invoke('Connect', localStorage.getItem('system_access_token'), params.id);
                }
            })();
        }
    }, []);

    return (
        <div className={styles.community}>
            <Header 
                src={community && community.header ? community.header : null} 
                isLoading={isLoading}
            />
            {isCommunityEditorOpen && <CommunityEditor 
                avatarValue={community && community.avatar ? community.avatar : null}
                headerValue={community && community.header ? community.header : null}
                nameValue={community && community.name ? community.name : null}
                descriptionValue={community && community.description ? community.description : null}
                open={isCommunityEditorOpen}
                close={() => setCommunityEditorState(false)}
                title={"Edit community"}
                callback={(name, description, avatar, header) => {
                    if (params.id) {
                        UpdateCommunity(params.id, name, description, avatar, header);
                    }
                }}
            />}
            <Description 
                isLoading={isLoading}
                isMobile={isMobile}
                avatar={community && community.avatar ? community.avatar : null}
                title={community && community.name ? community.name : null}
                subtitle={community && community.description ? community.description : null}
                stats={[
                    {title: 'Followers', amount: community && community.followers ? community.followers : 0},
                    {title: 'Publications', amount: publications.length},
                    {title: 'Worldwide',  amount: community && community.worldWide ? community.worldWide :  'None'},
                ]}
                buttons={[
                    {
                        title: isOwner ? 'Edit' : 'Follow', 
                        callback: () => {
                            if (isOwner) {
                                setCommunityEditorState(true);
                            } else {

                            }
                        }
                    },
                    // {
                    //     title: 'Visit server', 
                    //     callback: () => {}
                    // }
                ]}
            />
            <LocalMenu 
                items={[
                    {title: "Main", component: 
                        <div className={styles.contentWrapper}>
                            <Comments 
                                isPublications={true}
                                isPublicationAvailable={community && community.ownerId === userState.user.id}
                                fetch_callback={() => {}}
                                comments={publications}
                                id={params.id}
                                setUploadingComment={(comment, images, user, id) => 
                                    AddUploadingAlbumComment(
                                        '/api/community/publications', 
                                        comment, 
                                        images, 
                                        user, 
                                        id, 
                                        publications,
                                        setPublications,
                                        publicationQueueId,
                                        setPublicationQueueId
                                    )}
                                deleteCallback={async (id) => {
                                    await instance.delete(`/api/album-comments?id=${id}&albumId=${params.id}&type=${1}`)
                                }}
                            />
                        </div>
                    },
                    {title: "Photos", component: 
                        <div>
                            <h1></h1>
                        </div>
                    },
                    // {title: "Videos", component: 
                    //     <div className={styles.contentWrapper}>
                    //     </div>
                    // },
                    // {title: "Music", component: 
                    //     <div className={styles.contentWrapper}>
                    //     </div>
                    // },
                    {title: "Community", component: 
                        <div className={styles.contentWrapper}>
                        </div>
                    }
                ]}
                default={0}
                rightItems={[
                    (<HeaderSearch 
                        placeholder={"Search by name"}
                    />)
                ]}
            />
        </div>
    );
};

export default Community;