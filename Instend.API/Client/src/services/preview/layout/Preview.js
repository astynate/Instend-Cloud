import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PreviewHeader from '../widgets/header/Header';
import { ConvertFullDate } from '../../../utils/DateHandler';
import { Placeholder } from 'reactstrap';
import right from './images/right.png';
import './document.css';
import { PreviewImage } from '../widgets/files/PreviewImage/PreviewImage';
import { PreviewDocument } from '../widgets/files/DocumentPreview/PreviewDocument';
import { PreviewVideo } from '../widgets/files/PreviewVideo/PreviewVideo';

const Preview = ({close, files, index, fullFileLoadEndpoint, partialFileLoadEndpoint, additionalParams = {}}) => {
    const [currentIndex, setCurrentIndex] = useState(index);
    
    const fileTypeHandlers = [
        {
            types: ['png', 'jpg', 'jpeg', 'gif'], 
            object: <PreviewImage 
                key={files[currentIndex].id + "preview"} 
                endpoint={fullFileLoadEndpoint}
                domain={process.env.REACT_APP_SERVER_URL}
                file={files[currentIndex]} 
                additionalParams={additionalParams}
            />
        },
        {
            types: ['docx', 'doc', 'pdf', 'ppt', 'xls', 'pptx', 'xlsx'], 
            object: <PreviewDocument 
                key={files[currentIndex].id + "preview"} 
                endpoint={fullFileLoadEndpoint}
                domain={process.env.REACT_APP_SERVER_URL}
                file={files[currentIndex]} 
                additionalParams={additionalParams}
            />
        },
        {
            types: ['mp4', 'mov', 'mpeg-4'], 
            object: <PreviewVideo 
                key={files[currentIndex].id + "preview"}
                endpoint={partialFileLoadEndpoint}
                domain={process.env.REACT_APP_SERVER_URL}
                file={files[currentIndex]} 
                additionalParams={additionalParams}
            />
        }
    ]

    const getFileHandler = (type) => {
        const handler = fileTypeHandlers.find((handlerObj) =>
            handlerObj.types.includes(type.toLowerCase())
        );
    
        if (handler) {
            return handler.object;
        }

        return null;
    };

    const UpdateIndex = (value) => {
        setCurrentIndex(prev => {
            const newIndex = (prev + value) % files.length;
            return newIndex < 0 ? files.length - 1 < 0 ? 0 : files.length - 1 : newIndex;
        })
    }    

    if (files[currentIndex]) {
        return (
            <div className={styles.wrapper}>            
                <div 
                    className={styles.navigateButton} 
                    onClick={() => UpdateIndex(-1)}
                >
                    <img src={right} draggable="false" />
                </div>
                <div 
                    className={styles.navigateButton} 
                    id="right" 
                    onClick={() => UpdateIndex(1)}
                >
                    <img src={right} draggable="false" />
                </div>
                <PreviewHeader 
                    name={files[currentIndex].lastEditTime ? files[currentIndex].name : null}
                    time={files[currentIndex].lastEditTime ? ConvertFullDate(files[currentIndex].lastEditTime) : null}
                    close={close}
                    id={files[currentIndex].id}
                    error={() => {}}
                />
                {getFileHandler(files[currentIndex].type) && <div className={styles.preview}>
                    {getFileHandler(files[currentIndex].type)}
                </div>}
            </div>
        );
    } else {
        return (
            <div className={styles.wrapper}>
                <div className={styles.placeholder}>
                    <Placeholder title='No files selected' />
                </div>
            </div>
        );
    }
 };

export default Preview;
