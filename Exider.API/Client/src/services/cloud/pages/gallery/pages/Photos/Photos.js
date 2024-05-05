import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Sroll from '../../../../widgets/sroll/Scroll';
import { observer } from 'mobx-react-lite';
import galleryState from '../../../../../../states/gallery-state';
import { CalculateAverageEqual } from '../../../../widgets/item-list/ItemList';
import { GetPhotoById } from '../../layout/Gallery';
import { ConvertDate, ConvertFullDate } from '../../../../../../utils/DateHandler';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import { toJS } from 'mobx';
import PhotoList from '../../shared/photo-list/PhotoList';

const Photos = observer((props) => {
    const photosWrapper = useRef();
    const [date, setDate] = useState(null);
    const [current, setCurrent] = useState([]);
    const dataRef = useRef();

    useEffect(() => {
        const fetchPhotos = async () => {
          const startPhoto = await GetPhotoById(current[0]);
          const endPhoto = await GetPhotoById(current[current.length - 1]);
    
          try {
            if (startPhoto.lastEditTime && endPhoto.lastEditTime) {
              setDate(`${ConvertDate(startPhoto.lastEditTime)} — ${ConvertDate(endPhoto.lastEditTime)}`);
            }
          } catch {}
        }
        fetchPhotos();
    }, [current]);

    if (date === null && toJS(galleryState.photos).length > 0) {
        setDate(ConvertFullDate(galleryState.photos[0].lastEditTime));
    }
    
    const changeDate = () => {
        try {
            const element = photosWrapper.current;
            let children = Array.from(element.children);
    
            children = children.filter((item) => {
                let rect = item.getBoundingClientRect();
                return CalculateAverageEqual(rect.top, dataRef.current.offsetTop, 60);
            });
    
            if (children.length > 0) {
                setCurrent(children.map(e => e.id));
            } else if (galleryState.photos.length > 0) {
                setDate(ConvertFullDate(galleryState.photos[0].lastEditTime));
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        props.scroll.current.addEventListener('scroll', changeDate);
      
        return () => {
          try {
            props.scroll.current.removeEventListener('scroll', changeDate);
          } catch {}
        };
    }, []);

    return (
        <>
            {galleryState.photos && galleryState.photos.length > 0 &&<div className={styles.down}>
                <div className={styles.currentDate}>
                    <span className={styles.date} ref={dataRef}>{date}</span>
                    <span className={styles.location}>Yexider Cloud</span>
                </div>
            </div>}
            {galleryState.photos && galleryState.photos.length === 0 &&
                <div className={styles.placeholder}>
                    <Placeholder title='No photos or videos uploaded.' />
                </div>}
            <PhotoList 
                photos={galleryState.photos} 
                scale={props.scale}
                photoGrid={props.photoGrid}
                forwardRef={photosWrapper}
            />
            <Sroll
                scroll={props.scroll}
                isHasMore={galleryState.hasMore}
                array={galleryState.photos}
                callback={() => {
                    galleryState.GetPhotos();
                }}
            />
        </>
    );
});

export default Photos;