import React, { useEffect } from 'react';
import LayoutHeader from '../../../widgets/header/Header';
import styles from './styles/main.module.css';
import Search from '../../../features/search/Search';
import { observer } from 'mobx-react-lite';
import userState from '../../../../../states/user-state';
import ProfileDescription from '../widgets/profile-description/ProfileDescription';
import Header from '../../../features/profile/header/Header';
import HeaderSearch from '../../../widgets/album-view/compontens/header-search/HeaderSearch';
import LocalMenu from '../../../shared/ui-kit/local-menu/LocalMenu';
import PublicationsWrapper from '../../../features/publications-wrapper/PublicationsWrapper';

const Profile = observer((props) => {
  const { user } = userState;

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.content}>
      <Search />
      <LayoutHeader />
      <div className={styles.wrapper}>
        <Header src={user.header} />
        <ProfileDescription />
        <LocalMenu 
            items={[
              {title: "Publications", component: 
                <div className={styles.contentWrapper}>
                </div>
              },
              {title: "Comments", component: 
                <PublicationsWrapper>
                  <h1>!!!</h1>
                </PublicationsWrapper>
              },
              {title: "Communities", component: 
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
    </div>
  )
});

export default Profile;