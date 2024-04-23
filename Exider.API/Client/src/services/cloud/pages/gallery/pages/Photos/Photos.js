import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import { instance } from '../../../../../../state/Interceptors';
import Photo from '../../widgets/photo/Photo';
import Information from '../../../../shared/information/Information';
import { ConvertDate } from '../../../../../../utils/DateHandler';
import InfiniteScroll from 'react-infinite-scroll-component';

const Photos = (props) => {
    const [photos, setPhotos] = useState([]);
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(auto-fill, minmax(200px, 1fr))');
    const [dates, setDates] = useState([]);

    useEffect(() => {
        setGridTemplateColumns(`repeat(auto-fill, minmax(${props.scale}px, 1fr))`);
    }, [props.scale]);

    const ErrorMessage = (title, message) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setErrorState(true);
    }

    useEffect(() => {
        const GetPhotos = async () => {
          const response = await instance.get(`api/gallery?from=${0}&count=${20}`)
            .catch((error) => ErrorMessage('Attention!', error.response.data));

            setDates([]);
            setPhotos([]);

            if (response.data.length < 1) {
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
            
            setDates(dates);
            setPhotos(photos); 
        };
    
        setPhotos(Array.from({ length: 3 }).map((_, index) => (
          <Photo key={index} isPlaceholder={true} />)));
    
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
            <InfiniteScroll
                dataLength={photos.length}
                next={() => alert('!')}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more files to load</p>}
            >
                <div>
                    {photos.map((element, index) => {
                        return (
                            <div key={index}>
                                <div className={styles.date} >
                                    <span>{ConvertDate(dates[index])}</span>
                                </div>
                                <div className={styles.photos} style={{ gridTemplateColumns }}>
                                    {element}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </InfiniteScroll>
        </>
    );
 };

export default Photos;