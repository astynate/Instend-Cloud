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

const Community = ({isMobile}) => {
    const [isLoading, setLoadingState] = useState(true);
    const [community, setCommunity] = useState(null);
    const [isOwner, setIsOwnerState] = useState(false);
    const [isCommunityEditorOpen, setCommunityEditorState] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

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
                    {title: 'Publications', amount: community && community.publications ? community.publications : 0},
                    {title: 'Worldwide', amount: 'None'},
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
                    {
                        title: 'Visit server', 
                        callback: () => {}
                    }
                ]}
            />
            <LocalMenu 
                items={[
                    {title: "Main", component: 
                        <div>
                            <h1></h1>
                        </div>
                    },
                    {title: "Photos", component: 
                        <div>
                            <h1></h1>
                        </div>
                    },
                    {title: "Videos", component: 
                        <div className={styles.contentWrapper}>
                        </div>
                    },
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