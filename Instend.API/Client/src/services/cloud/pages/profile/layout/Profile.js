import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import ProfileDescription from '../widgets/profile-description/ProfileDescription';
import styles from './styles/main.module.css';
import MenuWithUnderline from '../../../features/navigation/menu-with-underline/MenuWithUnderline';
import MainProfilePage from '../pages/main/MainProfilePage';
import PhotosProfilePage from '../pages/photos/PhotosProfilePage';
import Header from '../../../widgets/header/Header';
import AccountController from '../../../../../api/AccountController';

const Profile = observer((props) => {
  const [account, setAccount] = useState(undefined);
  const [publications, setPublications] = useState([]);
  const [isHasMore, setHasMoreState] = useState(true);

  let params = useParams();

  const setAccountData = (data) => {
    if (!!data === false) {
      return;
    };

    setAccount(data);
  };

  useEffect(() => {
      AccountController.GetAccountData(
          setAccountData,
          () => {},
          params.id
      );
  }, [params.id]);

  useEffect(() => {
    setPublications([]);
    setHasMoreState(true);
  }, [account]);

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.content}>
      <Header isBackgroundLess={true} />
      <div className={styles.wrapper}>
        <ProfileDescription
          account={account}
          isMobile={props.isMobile}
        />
        <MenuWithUnderline 
          margin={20}
          items={[
            {
              title: "Main", 
              component: <MainProfilePage
                account={account}
                isHasMore={isHasMore}
                publications={publications}
                setHasMoreState={setHasMoreState}
                setPublications={setPublications}
              />
            },
            {
              title: "Photos", 
              component: <PhotosProfilePage 
                account={account} 
              />
            },
            {
              title: "Followers", 
              component: (<div className={styles.contentWrapper}></div>)
            },
          ]}
        />
      </div> 
    </div>
  );
});

export default Profile;