import React from 'react';
import styles from './styles/main.module.css';
import SubContentWrapper from '../../sub-content-wrapper/SubContentWrapper';

const Header = ({src, isLoading = false}) => {
  if (src && isLoading === false) {
    return (
      <SubContentWrapper>
        <div className={styles.header}>
          <img src={`data:image/png;base64,${src}`}  draggable={false} /> 
        </div>
      </SubContentWrapper>
    );
  }
   
  return (
    <SubContentWrapper>
      <div className={styles.header} id="loading">

      </div>
    </SubContentWrapper>
  );
};

export default Header;