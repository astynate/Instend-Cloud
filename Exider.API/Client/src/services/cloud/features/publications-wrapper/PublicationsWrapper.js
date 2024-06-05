import React from 'react';
import styles from './main.module.css';
import MainContentWrapper from '../main-content-wrapper/MainContentWrapper';

const PublicationsWrapper = ({children}) => {
    return (
        <MainContentWrapper>
            <div className={styles.wrapper}>
                {(children)}
            </div>
        </MainContentWrapper>
    );
 };

export default PublicationsWrapper;