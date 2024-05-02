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
import zoomIn from './images/zoom-in.png';
import zoomOut from './images/zoom-out.png';
import grid from './images/grid.png';
import warterfall from './images/waterfall.png';
import galleryState from '../../../../../states/gallery-state';
import { toJS } from 'mobx';
import Add from '../widgets/add/Add';

export const GetPhotoById = async (id) => {
  return await toJS(galleryState.photos.find(element => element.id === id));
}

const Gallery = observer((props) => {
  const [scale, setScale] = useState(2);
  const [photoGrid, setPhotoGeridState] = useState('grid');
  const [objectFit, setObjectFit] = useState('cover');
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
              <img 
                src={objectFit === 'contain' ? zoomIn : zoomOut}
                className={styles.button} 
                onClick={() => setObjectFit(prev => prev === 'cover' ? 'contain' : 'cover')} 
              />
              <img 
                src={photoGrid === 'grid' ? warterfall : grid} 
                className={styles.button} 
                onClick={() => setPhotoGeridState(prev => prev === 'grid' ? 'waterfall' : 'grid')} 
              />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <Add />
          <Routes>
            <Route 
              path=''
              element={
                <Photos 
                  photoGrid={photoGrid} 
                  objectFit={objectFit}
                  scale={scale}
                  scroll={scroll}
              />} 
            />
            <Route 
              path='/albums' 
              element={<Albums />} 
              photoGrid={photoGrid} 
            />
          </Routes>
        </div>
    </div>
  )
});

export default Gallery;