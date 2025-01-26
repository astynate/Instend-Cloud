import React, { useState } from 'react';
import { ConvertFullDate } from '../../../utils/handlers/DateHandler';
import { Placeholder } from 'reactstrap';
import PreviewImage from '../widgets/files/PreviewImage/PreviewImage';
import styles from './main.module.css';
import right from './images/right.png';
import './document.css';
import PreviewHeader from '../widgets/header/PreviewHeader';
import StorageController from '../../../api/StorageController';

const Preview = ({
        close = () => {}, 
        files = [], 
        index = 0, 
        additionalParams = {}
    }) => {

    const [currentIndex, setCurrentIndex] = useState(index);
    
    const fileTypeHandlers = [
        {
            types: ['png', 'jpg', 'jpeg', 'gif'], 
            object: <PreviewImage 
                key={files[currentIndex].id + "preview"}
                file={files[currentIndex]} 
                additionalParams={additionalParams}
            />
        },
        // {
        //     types: ['docx', 'doc', 'pdf', 'ppt', 'xls', 'pptx', 'xlsx'], 
        //     object: <PreviewDocument 
        //         key={files[currentIndex].id + "preview"} 
        //         file={files[currentIndex]} 
        //         additionalParams={additionalParams}
        //     />
        // },
        // {
        //     types: ['mp4', 'mov', 'mpeg-4'], 
        //     object: <PreviewVideo 
        //         key={files[currentIndex].id + "preview"}
        //         file={files[currentIndex]} 
        //         additionalParams={additionalParams}
        //     />
        // }
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
                <div className={styles.contentWrapper}>
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
                    {getFileHandler(files[currentIndex].type) && getFileHandler(files[currentIndex].type)}
                    <div className={styles.fileList}>
                        {files.map((file, i) => {
                            return (
                                <img 
                                    key={file.id}
                                    state={currentIndex == i ? 'active' : null}
                                    className={styles.fileListItem}
                                    src={StorageController.getFullFileURL(file.path)}
                                    draggable="false" 
                                    onClick={() => setCurrentIndex(i)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.placeholder}>
                <Placeholder title='No files selected' />
            </div>
        </div>
    );
 };

export default Preview;
