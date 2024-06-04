import React from 'react';
import styles from './main.module.css';
import Button from '../../../../shared/ui-kit/button/Button';
import StatisticalUnit from '../../../../shared/ui-kit/statistical-unit/StatisticalUnit';

const CommunityPreview = () => {
  return (
    <div className={styles.communityPreview}>
        <div className={styles.header}>
            <div className={styles.avatar}></div>
            <div className={styles.partiсipants}><StatisticalUnit title="Partiсipants" amount={'-'} /></div>
        </div>
        <div className={styles.content}>
            <span className={styles.name}>Name</span>
            <span className={styles.description}>lorem adada dad a sda da  da da sd a asdasd asda sdasd asda sd</span>
            <div className={styles.controlPanel}>
                <Button value="Follow" />
                <Button value="Visit" />
            </div>
        </div>
    </div>
  )
}

export default CommunityPreview;