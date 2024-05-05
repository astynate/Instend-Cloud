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
import galleryState from '../../../../../states/gallery-state';
import { toJS } from 'mobx';
import share from './images/share.png';
import download from './images/download.png';
import SimpleButton from '../../../shared/ui-kit/header/simple-button/SimpleButton';
import SelectItems from '../../../shared/ui-kit/header/select-items/SelectItems.js';
import sort from './images/sort.png';
import grid from './images/grid.png';
import Add from '../widgets/add/Add.js';
import AlbumView from '../pages/AlbumView/AlbumView.js';

export const GetPhotoById = async (id) => {
  return await toJS(galleryState.photos.find(element => element.id === id));
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

  const [scale, setScale] = useState(2);
  const [photoGrid, setPhotoGeridState] = useState('grid');
  const [PhotosSortState, setSortingTypeState] = useState(PhotosSortFunctions);
  const [SortingOrderState, setSortingOrderState] = useState(SortingOrder);
  const [albumId, setAlbumId] = useState(null);
  const scroll = useRef();

  useEffect(() => {
    let type = PhotosSortState
      .find(element => element.isSelected === true);

    let ordingState = SortingOrderState
      .find(element => element.isSelected === true);

    if (type && ordingState) {
      const ordingStateId = ordingState.title === 'Accending';

      if (type.title === 'Name') {
        galleryState.SortPhotosByName(ordingStateId);
      } else {
        galleryState.SortPhotosByDate(ordingStateId);
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
        <div className={styles.header}>
          <div className={styles.up}>
              <div>
                <Range
                  min={1}
                  max={5}
                  value={scale}
                  setValue={setScale}
                  inc={1}
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
            <div className={styles.buttons}>
              <SelectItems 
                icon={sort}
                items={[PhotosSortState, SortingOrderState]}
                states={[setSortingTypeState, setSortingOrderState]}
              />
              <SelectItems icon={grid} />
              <SimpleButton icon={share} />
              <SimpleButton icon={download} />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <Add id={albumId} />
          <Routes>
            <Route 
              path=''
              element={
                <Photos 
                  photoGrid={photoGrid} 
                  scale={scale}
                  scroll={scroll}
              />} 
            />
            <Route 
              path='/albums' 
              element={<Albums />} 
              photoGrid={photoGrid} 
            />
            <Route 
              path='/albums/:id' 
              element={<AlbumView 
                setAlbumId={setAlbumId}
                photoGrid={photoGrid} 
                scale={scale}
                scroll={scroll} 
              />} 
              photoGrid={photoGrid} 
              scroll={scroll}
            />
          </Routes>
        </div>
    </div>
  )
});

export default Gallery;