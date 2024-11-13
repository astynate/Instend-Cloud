import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { Route, Routes } from 'react-router-dom';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import styles from './main.module.css';
import Photos from '../pages/photos/Photos.js';
import Albums from '../pages/albums/Albums';
import Album from '../pages/album/Album';
import storageState from '../../../../../state/entities/StorageState.js';
import GalleryHeader from '../widgets/gallery-header/GalleryHeader.jsx';

export const GetPhotoById = async (id) => {
  return await toJS(storageState.GetSelectionByType(FileAPI.imageTypes).find(element => element.id === id));
}

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
  const [PhotosSortState, setSortingTypeState] = useState(PhotosSortFunctions);
  const [SortingOrderState, setSortingOrderState] = useState(SortingOrder);
  const scroll = useRef();

  useEffect(() => {
    let type = PhotosSortState
      .find(element => element.isSelected === true);

    let ordingState = SortingOrderState
      .find(element => element.isSelected === true);

    if (type && ordingState) {
      const ordingStateId = ordingState.title === 'Accending';

      if (type.title !== 'Name' && ordingStateId) {
        setSortingType(0);
      } else if (type.title !== 'Name' && ordingStateId === false) {
        setSortingType(1);
      } else if (type.title === 'Name' && ordingStateId) {
        setSortingType(2);
      } else if (type.title === 'Name' && ordingStateId === false) {
        setSortingType(3);
      }
    }
  }, [PhotosSortState, SortingOrderState]);

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