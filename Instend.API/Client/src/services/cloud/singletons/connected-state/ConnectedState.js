import React from 'react';
import styles from './main.module.css';
import disconnected from './images/disconnected.png';
import connecting from './images/connecting.png';
import ApplicationState from '../../../../state/application/ApplicationState';

const ConnectedState = () => {
    return (
        <div className={styles.disconnected} id={ApplicationState.connectionState === 1 ? 'connecting' : null}>
            <img src={ApplicationState.connectionState === 1 ? connecting : disconnected} className={styles.image} />
            <span>{ApplicationState.connectionState === 1 ? 'Connecting' : 'Disconnected'}</span>
        </div>
    );
 };

export default ConnectedState;