import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../widgets/header/Header';
import { observer } from 'mobx-react-lite';
import Search from '../../../features/search/Search';
import { Route, Routes } from 'react-router-dom';
import Menu from '../../../widgets/menu/Menu';
import styles from './main.module.css';
import Photos from '../pages/Photos/Photos';
import Albums from '../pages/Albums/Albums';
import Range from '../../../shared/range/Range';

const Gallery = observer((props) => {
  const [scale, setScale] = useState(150);
  const scroll = useRef();

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    }

  }, [props.setPanelState]);

  return (
    <div className={styles.gallery} ref={scroll}>
        <Header />
        <Search />
        <div className={styles.header}>
            <div className={styles.navigation}>
              <Range
                min={100}
                max={200}
                value={scale}
                setValue={setScale}
                inc={25}
              />
            </div>
            <Menu 
              items={[
                {
                  'name': 'Photos', 
                  'route': '/gallery'
                }, 
                {
                  'name': 'Albums', 
                  'route': '/gallery/albums'
                }
              ]}
            />
          </div>
        <div className={styles.content}>
          <Routes>
            <Route path='' element={<Photos scale={scale} scroll={scroll} />} />
            <Route path='/albums' element={<Albums />} />
          </Routes>
        </div>
    </div>
  )
});

export default Gallery;