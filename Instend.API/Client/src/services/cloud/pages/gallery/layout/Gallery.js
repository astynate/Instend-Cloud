import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import styles from './main.module.css';
import Photos from '../pages/photos/Photos.js';
import Albums from '../pages/albums/Albums';
import Album from '../pages/album/Album';
import GalleryHeader from '../widgets/gallery-header/GalleryHeader.jsx';

const Gallery = observer((props) => {
  const scroll = useRef();

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(false);
    };
  }, [props.setPanelState]);

  return (
    <div className={styles.gallery} ref={scroll}>
        <Header />
        <Search />
        <GalleryHeader />
        <div className={styles.content}>
          <Routes>
            <Route 
              path=''
              element={<Photos scroll={scroll} />} 
            />
            <Route 
              path='/albums' 
              element={<Albums />} 
            />
            <Route 
              path='/albums/:id' 
              element={<Album scroll={scroll} />} 
              scroll={scroll}
            />
          </Routes>
        </div>
    </div>
  )
});

export default Gallery;