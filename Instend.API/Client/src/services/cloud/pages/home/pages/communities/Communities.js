import React, { useEffect } from 'react';
import styles from './main.module.css';
import CommunityPreview from '../../widgets/community-preview/CommunityPreview';
import homeState from '../../../../../../states/home-state';
import { observer } from 'mobx-react-lite';
import SubContentWrapper from '../../../../features/sub-content-wrapper/SubContentWrapper';

const Communities = observer(() => {
  useEffect(() => {
    homeState.GetPopularCommunities();
  }, []);

  return (
    <SubContentWrapper>
      <div className={styles.content}>
        {homeState.communities && homeState.communities.map((element, index) => {
            return (
                <CommunityPreview 
                  key={index}
                  id={element.id}
                  name={element.name}
                  description={element.description}
                  avatar={element.avatar}
                  header={element.header}
                  followers={element.followers}
                />
            );
        })}
      </div>
    </SubContentWrapper>
  )
});

export default Communities;