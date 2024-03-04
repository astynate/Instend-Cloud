import React from 'react';
import styles from './styles/main.module.css';
import { useTranslation } from 'react-i18next';

const Data = (props) => {

  const { t } = useTranslation();

  return (

    <div className={styles.data}>
        <div className={styles.counter}>
            <h2>{props.coins}</h2>
            <span>{t('cloud.profile.coins')}</span>
        </div>
        <div className={styles.counter}>
            <h2>{props.friends}</h2>
            <span>{t('cloud.profile.friends')}</span>
        </div>
        <div className={styles.counter}>
            <h2>{props.space}</h2>
            <span>GB</span>
        </div>
    </div>

  )

}

export default Data;