import React from 'react';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';
import { Link } from 'react-router-dom';

const CommunityPreview = ({id, name, description, avatar, header, followers}) => {
  return (
    <Link 
      to={`/community/${id}`}
      className={styles.communityPreview}
    >
        <div className={styles.header}>
            <img src={`data:image/png;base64,${header}`} />
            <div className={styles.avatar}>
              <img src={`data:image/png;base64,${avatar}`} />
            </div>
            <div className={styles.partiсipants}><StatisticalUnit title="Followers" amount={followers} /></div>
        </div>
        <div className={styles.content}>
            <span className={styles.name}>{name}</span>
            <span className={styles.description}>{description}</span>
            <div className={styles.controlPanel}>
                <Button value="Follow" />
                <Button value="Visit" />
            </div>
        </div>
    </Link>
  )
}

export default CommunityPreview;