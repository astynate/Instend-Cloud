import React, { useEffect, useState } from 'react';
import { instance } from '../../../../../../state/Interceptors';
import { ConvertDate } from '../../../../../../utils/DateHandler';
import styles from './main.module.css';
import Photo from '../../widgets/photo/Photo';
import Information from '../../../../shared/information/Information';
import Sroll from '../../../../widgets/sroll/Scroll';

const Photos = (props) => {
    const [photos, setPhotos] = useState([]);
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(auto-fill, minmax(200px, 1fr))');
    const [dates, setDates] = useState([]);
    const [isHasMore, setHasMore] = useState(true);

    useEffect(() => {
        setGridTemplateColumns(`repeat(auto-fill, minmax(${props.scale}px, 1fr))`);
    }, [props.scale]);

    const ErrorMessage = (title, message) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setErrorState(true);
    }

    const GetPhotos = async () => {
        const response = await instance.get(`api/gallery?from=${0}&count=${3}`)
          .catch((error) => ErrorMessage('Attention!', error.response.data));

        if (response.data.length < 1) {
            setHasMore(false);
            return;
        }

        let dates = [response.data[0].lastEditTime];
        let index = 0;
        let photos = [];
        
        for (let i = 0; i < response.data.length; i++) {
            const dateOne = new Date(response.data[i].lastEditTime);
            const dateTwo = new Date(response.data[index].lastEditTime);
        
            if (dateOne.getDay() !== dateTwo.getDay() || i === response.data.length - 1) {
                photos.push(response.data.slice(index, i).map(element => {
                    return <Photo 
                        key={element.id} 
                        file={element}
                    />
                }));
        
                dates.push(response.data[i].lastEditTime);
                index = i;
            }
        }
          
        setDates(prev => [...prev, dates]);
        setPhotos(prev => [...prev, photos]); 
    };

    useEffect(() => {
        setDates([]);
        setPhotos([]);
        GetPhotos();
    }, []);

    return (
        <>
            <Information
                open={isError}
                close={() => setErrorState(false)}
                title={errorTitle}
                message={errorMessage}
            />
            <div>
                {photos.map((element, index) => {
                    return (
                        <div key={index}>
                            <div className={styles.date} >
                                <span>{dates[index] ? ConvertDate(dates[index]) : null}</span>
                            </div>
                            <div className={styles.photos} style={{ gridTemplateColumns }}>
                                {element}
                            </div>
                        </div>
                    )
                })}
                <Sroll 
                    scroll={props.scroll}
                    isHasMore={isHasMore}
                    array={photos}
                    callback={() => {
                        GetPhotos();
                    }}
                />
            </div>
        </>
    );
 };

export default Photos;