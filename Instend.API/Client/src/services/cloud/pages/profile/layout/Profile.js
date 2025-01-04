import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ProfileDescription from '../widgets/profile-description/ProfileDescription';
import styles from './styles/main.module.css';
import HeaderSearch from '../../../templates/album-view-template/compontens/header-search/HeaderSearch';
import MenuWithUnderline from '../../../features/navigation/menu-with-underline/MenuWithUnderline';
import MainProfilePage from '../pages/main/MainProfilePage';
import AccountController from '../../../../../api/AccountController';
import AccountState from '../../../../../state/entities/AccountState';

const Profile = observer((props) => {
  const [publications, setPublications] = useState([]);
  const [isHasMore, setHasMoreState] = useState(true);

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        <ProfileDescription
          isMobile={props.isMobile}
        />
        <MenuWithUnderline 
          margin={20}
          items={[
            {
              title: "Main", 
              component: <MainProfilePage
                isHasMore={isHasMore}
                publications={publications}
                setHasMoreState={setHasMoreState}
                setPublications={setPublications}
              />
            },
            {title: "Photos", component: (<div className={styles.contentWrapper}></div>)},
            {title: "Followers", component: (<div className={styles.contentWrapper}></div>)},
          ]}
          rightItems={[
              (<HeaderSearch
                  placeholder={"Search by name"}
              />)
          ]}
        />
      </div> 
    </div>
  );
});

export default Profile;