import React, { useEffect, useRef, useState } from 'react';
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
  const PhotosSortFunctions = [
    {
      "title": "Name",
      "isSelected": false
    },
    {
      "title": "Last edit date",
      "isSelected": true
    }
  ];
  
  const SortingOrder = [
    {
      "title": "Accending",
      "isSelected": true
    },
    {
      "title": "Descending",
      "isSelected": false
    }
  ];

  const Template = [
    {
      "title": "Grid",
      "isSelected": true
    },
    {
      "title": "Waterfalll",
      "isSelected": false
    }
  ];

  const [scale, setScale] = useState(2);
  const [template, setTemplate] = useState(Template);
  const [sortingType, setSortingType] = useState(0);
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
        <GalleryHeader />
        <div className={styles.content}>
          <Routes>
            <Route 
              path=''
              element={
                <Photos 
                  photoGrid={template} 
                  scale={scale}
                  scroll={scroll}
                  sortingType={sortingType}
              />} 
            />
            <Route 
              path='/albums' 
              element={<Albums />} 
              photoGrid={template} 
            />
            <Route 
              path='/albums/:id' 
              element={<Album 
                photoGrid={template} 
                scale={scale}
                scroll={scroll} 
              />} 
              photoGrid={template} 
              scroll={scroll}
            />
          </Routes>
        </div>
    </div>
  )
});

export default Gallery;