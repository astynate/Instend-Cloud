import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Follow } from '../../pages/home/api/CommunityAPI';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';
import userState from '../../../../states/user-state';

const Community = observer(({id, name, description, avatar, header, followers, isLoading = false}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.communityPreview}>
        <div className={styles.header} id={isLoading ? 'placeholder' : null}>
            {header && <img src={`data:image/png;base64,${header}`} draggable="false" />}
            <div className={styles.avatar} id={isLoading ? 'placeholder' : null}>
              {avatar && <img src={`data:image/png;base64,${avatar}`} draggable="false" />}
            </div>
            {isLoading === false && <div className={styles.partiсipants}><StatisticalUnit title="Followers" amount={followers} /></div>}
        </div>
        <div className={styles.content}>
            <span className={styles.name} id={isLoading ? 'placeholder' : null}>{name}</span>
            <span className={styles.description} id={isLoading ? 'placeholder' : null}>{description}</span>
            {isLoading === false && <div className={styles.controlPanel}>
                <Button value={userState.communities.map(element => element.id).includes(id) ? 'Unfollow' : "Follow"}
                  callback={(event) => {
                    event.stopPropagation();
                    Follow(id);
                  }}
                />
                <Button value="Visit" 
                  callback={() => {
                    navigate(`/community/${id}`);
                  }}
                />
            </div>}
        </div>
    </div>
  )
});

export default Community;