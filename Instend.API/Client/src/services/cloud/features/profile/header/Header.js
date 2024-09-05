import React from 'react';
import styles from './styles/main.module.css';
import MainContentWrapper from '../../main-content-wrapper/MainContentWrapper';

const Header = ({src, isLoading = false}) => {
  if (src && isLoading === false) {
    return (
      <MainContentWrapper>
        <div className={styles.header}>
          <img src={`data:image/png;base64,${src}`}  draggable={false} /> 
        </div>
      </MainContentWrapper>
    );
  } else {
    return (
      <MainContentWrapper>
        <div className={styles.header} id="loading">

        </div>
      </MainContentWrapper>
    );
  }
};

export default Header;