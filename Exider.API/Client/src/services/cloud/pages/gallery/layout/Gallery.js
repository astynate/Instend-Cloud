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
import { ConvertDate } from '../../../../../utils/DateHandler';

export const GetPhotoById = async (id) => {
  return await toJS(galleryState.photos.find(element => element.id === id));
}

const Gallery = observer((props) => {
  const [scale, setScale] = useState(2);
  const [photoGrid, setPhotoGeridState] = useState('grid');
  const [objectFit, setObjectFit] = useState('cover');
  const [current, setCurrent] = useState([]);
  const scroll = useRef();
  const dataRef = useRef();
  const [date, setDate] = useState(Date.now);
  const [folder, setFolder] = useState('Yexider Cloud');
  
  useEffect(() => {
    const fetchPhotos = async () => {
      const startPhoto = await GetPhotoById(current[0]);
      const endPhoto = await GetPhotoById(current[current.length - 1]);

      try {
        if (startPhoto.lastEditTime && endPhoto.lastEditTime) {
          setDate(`${ConvertDate(startPhoto.lastEditTime)} — ${ConvertDate(endPhoto.lastEditTime)}`);
          setFolder(startPhoto.name);
        }
      } catch {}
    }
    fetchPhotos();
  }, [current]);

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
            <div className={styles.navigation}>
              <Range
                min={1}
                max={5}
                value={scale}
                setValue={setScale}
                inc={1}
              />
            </div>
          </div>
          <div className={styles.down}>
            <div className={styles.currentDate}>
              <span className={styles.date} ref={dataRef}>{date}</span>
              <span className={styles.location}>{folder}</span>
            </div>
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
          <Routes>
            <Route 
              path='' 
              element={
                <Photos 
                  photoGrid={photoGrid} 
                  objectFit={objectFit}
                  scale={scale}
                  scroll={scroll}
                  setCurrent={setCurrent}
                  dataRef={dataRef}
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