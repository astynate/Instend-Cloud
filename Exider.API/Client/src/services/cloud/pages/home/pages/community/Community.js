import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Header from '../../../../features/profile/header/Header';
import { instance } from '../../../../../../state/Interceptors';
import Description from '../../../../widgets/description/Description';
import HeaderSearch from '../../../../widgets/album-view/compontens/header-search/HeaderSearch';
import LocalMenu from '../../../../shared/ui-kit/local-menu/LocalMenu';
import { useNavigate, useParams } from 'react-router-dom';

const Community = ({isMobile}) => {
    const [isLoading, setLoadingState] = useState(true);
    const [community, setCommunity] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            (async () => {
                await instance
                    .get(`/api/community/single?id=${params.id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            setCommunity(response.data);
                            setLoadingState(false);
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
                        title: 'Follow', 
                        callback: () => {}
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