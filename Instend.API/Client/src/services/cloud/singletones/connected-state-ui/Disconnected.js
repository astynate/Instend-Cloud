import React from 'react';
import styles from './main.module.css';
import disconnected from './images/disconnected.png';
import connecting from './images/connecting.png';
import applicationState from '../../../../state/application/application-state';

const Disconnected = () => {
    return (
        <div className={styles.disconnected} id={applicationState.connectionState === 1 ? 'connecting' : null}>
            <img src={applicationState.connectionState === 1 ? connecting : disconnected} className={styles.image} />
            <span>{applicationState.connectionState === 1 ? 'Connecting' : 'Disconnected'}</span>
        </div>
    );
 };

export default Disconnected;