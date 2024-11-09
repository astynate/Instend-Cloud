import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { instance } from '../../../../../state/Interceptors';
import { AddUploadingAlbumComment } from '../../../api/CommentAPI';
import { galleryWSContext } from '../../../layout/Layout';
import LayoutHeader from '../../../widgets/header/Header';
import styles from './styles/main.module.css';
import Search from '../../../features/search/Search';
import userState from '../../../../../state/entities/UserState';
import ProfileDescription from '../widgets/profile-description/ProfileDescription';
import Header from '../../../features/profile/header/Header';
import HeaderSearch from '../../../widgets/album-view/compontens/header-search/HeaderSearch';
import LocalMenu from '../../../shared/ui-kit/local-menu/LocalMenu';
import CommunityPreview from '../../home/widgets/community-preview/CommunityPreview';
import Comments from '../../../widgets/social/comments/Comments';
import TextBlock from '../widgets/text-block/TextBlock';
import plus from './images/plus.png';

const Profile = observer((props) => {
  const { user } = userState;

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    }
  }, [props.setPanelState]);

  galleryWSContext.useSignalREffect(
    "AddUserPublication",
    ({comment, user, queueId}) => {
        comment = {comment: comment, user: user};
        userState.AddPublication(comment, queueId);
    }
  );

  galleryWSContext.useSignalREffect(
    "DeleteUserPublication",
    (id) => {
      userState.DeletePublication(id);
    }
  );

  return (
    <div className={styles.content}>
      <Search />
      <LayoutHeader isMobile={props.isMobile} />
      <div className={styles.wrapper}>
        <Header src={user.header} />
        <ProfileDescription isMobile={props.isMobile} />
        <LocalMenu 
          items={[
            {title: "Publications", component: 
              <div className={styles.contentWrapper}>
                <div className={styles.leftPanel}>
                  <TextBlock />
                  <div className={styles.create}>
                    <img src={plus} draggable="false" />
                  </div>
                </div>
                <Comments 
                  isPublications={true}
                  isPublicationAvailable={true}
                  fetch_callback={userState.GetPublications}
                  comments={userState.publications}
                  id={userState.user.id}
                  setUploadingComment={(comment, images, user, id) => 
                      AddUploadingAlbumComment(
                          '/api/user/publications', 
                          comment, 
                          images, 
                          user, 
                          id, 
                          userState.publications,
                          userState.SetPublications,
                          userState.publicationQueueId,
                          userState.setPublicationQueueId
                      )}
                  deleteCallback={async (id) => {
                      await instance.delete(`/api/album-comments?id=${id}&albumId=${userState.user.id}&type=${2}`)
                  }}
                />
              </div>
            },
            {title: "Communities", component: 
              <div className={styles.contentWrapper}>
                <div className={styles.communities}>
                  {userState.communities.map((element, index) => {
                    if (!element.name) {
                      userState.GetCommunity(element.id);
                    }
                    return (
                      <CommunityPreview 
                        key={index}
                        id={element.id}
                        name={element.name}
                        description={element.description}
                        avatar={element.avatar}
                        header={element.header}
                        followers={element.followers}
                        isLoading={element.name === undefined}
                      />
                    );
                  })}
                </div>
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
    </div>
  )
});

export default Profile;