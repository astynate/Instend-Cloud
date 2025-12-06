import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styles from './main.module.css';

const CollectionPage = observer(({setPanelState, isMobile = false}) => {
  const selectPlaceWrapper = useRef();

  useEffect(() => {
    if (setPanelState) {
      setPanelState(false); 
    };
  }, [setPanelState]);

  return (
    <div className={styles.wrapper} ref={selectPlaceWrapper}>

    </div>
  );
});

export default CollectionPage;