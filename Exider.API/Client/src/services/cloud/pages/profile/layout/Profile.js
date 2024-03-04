import React, { useEffect } from 'react';
import LayoutHeader from '../../../widgets/header/Header';
import Header from '../shared/header/Header';
import styles from './styles/main.module.css';
import Description from '../widgets/description/Description';
import Search from '../../../features/search/Search';
import { observer } from 'mobx-react-lite';
import userState from '../../../../../states/user-state';

const Profile = observer((props) => {

  const { user } = userState;

  useEffect(() => {

    if (props.setPanelState) {
        props.setPanelState(false);
    }

  }, [props.setPanelState]);

  return (

    <div className={styles.content}>
      <LayoutHeader>
        <Search />
      </LayoutHeader>
      <div className={styles.wrapper}>
        <Header src={user.header} />
        <Description />
      </div>
    </div>

  )

});

export default Profile;