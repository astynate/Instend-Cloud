import React, { useEffect, useRef, useState } from "react";
import { Back, Next } from "../../../../shared/navigate/Navigate";
import styles from './styles/main.module.css';
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import CropImage from './Operations';

const Crop = (props) => {
    const [isMouseDown, setMouseDown] = useState(false);
    const [image, setImage] = useState();
    const [offsetTop, setOffsetTop] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const [areaHeight, setAreaHeight] = useState(0);
    const [areaWidth, setAreaWidth] = useState(0);
    const [imageSize, setImageSize] = useState([0, 0]);
    const [objectFit, setObjectFit] = useState('width');
    const [currentOffestX, setCurrentOffsetX] = useState(0);
    const [currentOffestY, setCurrentOffsetY] = useState(0);
    const [croppedAvatar, setCroppedAvatar] = useState(image);
    const [cropState, setCropState] = useState(false);

    const wrapperRef = useRef();
    
    const HEIGHT_ALIGNMENT = 450;
    const WIDTH_ALIGNMENT = 500;

    useEffect(() => {
        setOffsetTop(getComputedStyle(wrapperRef.current)
            .getPropertyValue('--top').replace('px', ''));

        setOffsetLeft(getComputedStyle(wrapperRef.current)
            .getPropertyValue('--left').replace('px', ''));

    }, [offsetTop, offsetLeft]);

    const onloadImage = () => {
        const height = image.naturalHeight;
        const width = image.naturalWidth;

        setImageSize([height, width]);

        if ((width / height) <= props.aspectRatio) {
            const aspectRatio = HEIGHT_ALIGNMENT / height;

            setAreaHeight(width * aspectRatio / props.aspectRatio);
            setAreaWidth(width * aspectRatio);
            setObjectFit('height');
        } else {
            const aspectRatio = WIDTH_ALIGNMENT / width;

            setAreaHeight(height * aspectRatio);
            setAreaWidth(height * aspectRatio * props.aspectRatio);
            setObjectFit('width');
        }
    };

    const readerOnloadEvent = (event) => {
        const image = new Image();

        image.src = event.target.result;
        image.onload = onloadImage;

        if (event.target.result) {
            setImage(event.target.result);
        }
    }

    useEffect(() => {
        const file = props.image;
        const reader = new FileReader();
    
        reader.onload = readerOnloadEvent;
    
        if (file) {
            reader.readAsDataURL(file);
        }
    }, [props.image]);
    

    const setClientOffset = (x, y) => {
        setClientX(x);
        setClientY(y);

        setMouseDown(true);
    };

    const clientOffsetRecovery = () => {
        setMouseDown(false);
        setCurrentOffsetX(offsetLeft);
        setCurrentOffsetY(offsetTop);
        setClientX(0);
        setClientY(0);
    };

    const MoveArea = (x, y) => {
        if (isMouseDown) {
            const offsetY = y - clientY + parseInt(currentOffestY);
            const offsetX = x - clientX + parseInt(currentOffestX);

            if (objectFit === 'height') {
                if (offsetY + areaHeight < HEIGHT_ALIGNMENT) {
                    setOffsetTop(parseInt(offsetY <= 0 ? 1 : offsetY));
                }

                if (offsetX + areaWidth < HEIGHT_ALIGNMENT / imageSize[0] * imageSize[1]) {
                    setOffsetLeft(parseInt(offsetX <= 0 ? 1 : offsetX));
                }
            } 
            else {  
                if (offsetY + areaHeight < WIDTH_ALIGNMENT / imageSize[1] * imageSize[0]) {
                    setOffsetTop(parseInt(offsetY <= 0 ? 1 : offsetY));
                }

                if (offsetX + areaWidth < WIDTH_ALIGNMENT) {
                    setOffsetLeft(parseInt(offsetX <= 0 ? 1 : offsetX));
                }
            }
        }
    };

    const TransformScale = (x, type) => {
        if (isMouseDown) {
            const offset = x - clientX;

            if (type === 0) {
                if (offset > 0) {
                    Decrease(Math.abs(offset));
                } else {
                    Icrease(Math.abs(offset));
                }
            } else {
                if (offset < 0) {
                    Decrease(Math.abs(offset));
                } else {
                    Icrease(Math.abs(offset));
                }
            }
        }
    };

    const Decrease = (size) => {
        if (areaHeight - size > 70 && areaWidth - size > 70) {
            setAreaHeight(areaHeight - size);
            setAreaWidth(areaWidth - size * props.aspectRatio);
            setOffsetTop(prev => parseInt(prev) + size / 2);
            setOffsetLeft(prev => parseInt(prev) + size / 2);
        }
    };

    const Icrease = (size) => {
        let MAX_HEIGHT = objectFit === 'height' ? HEIGHT_ALIGNMENT : WIDTH_ALIGNMENT / imageSize[1] * imageSize[0];
        let MAX_WIDTH = objectFit === 'width' ? WIDTH_ALIGNMENT : 450 / imageSize[0] * imageSize[1];

        if (areaHeight + size < MAX_HEIGHT && areaWidth + size < MAX_WIDTH) {
            setAreaHeight(areaHeight + size);
            setAreaWidth(areaWidth + size * props.aspectRatio);
            setOffsetTop(prev => parseInt(prev) - size / 2);
            setOffsetLeft(prev => parseInt(prev) - size / 2);
        }
    };

    return (
        <PopUpWindow isOpen={props.isOpen} setOpenState={props.setOpenState}>
            <CropImage 
                image={image} 
                x={objectFit === 'width' ? imageSize[1] / WIDTH_ALIGNMENT * offsetLeft : imageSize[0] / HEIGHT_ALIGNMENT * offsetLeft}
                y={objectFit === 'height' ? imageSize[0] / HEIGHT_ALIGNMENT * offsetTop : imageSize[1] / WIDTH_ALIGNMENT * offsetTop}
                height={objectFit === 'height' ? imageSize[0] / HEIGHT_ALIGNMENT * areaHeight : imageSize[1] / WIDTH_ALIGNMENT * areaHeight}
                width={objectFit === 'height' ? imageSize[0] / HEIGHT_ALIGNMENT * areaWidth : imageSize[1] / WIDTH_ALIGNMENT * areaWidth}
                setCroppedImage={setCroppedAvatar}
                cropState={cropState}
                setOpenState={props.setOpenState}
                setAvatar={props.setAvatar}
                setContext={setContext}
                Update={props.Update}
            />
            <div 
                className={styles.imageWrapper}
                ref={wrapperRef}
                style={{
                    '--top': `${offsetTop}px`,
                    '--left': `${offsetLeft}px`,
                    '--height': `${areaHeight}px`,
                    '--width': `${areaWidth}px`
                }}>
                <div className={styles.imageShape} id={objectFit}>
                    <div 
                        className={styles.crop}                                     
                        onMouseUp={() => clientOffsetRecovery()}
                        onMouseLeave={() => clientOffsetRecovery()}
                    >
                        <div className={styles.top}></div>
                        <div className={styles.middle}>
                            <div className={styles.left}></div>
                            <div className={styles.workspace}>
                                <div 
                                    className={styles.dragAndDropPoint} 
                                    onMouseDown={(event) => setClientOffset(event.clientX, event.clientX)}
                                    onMouseMove={(event) => TransformScale(event.clientX, 0)}
                                    onTouchStart={(event) => setClientOffset(event.touches[0].clientX, event.touches[0].clientY)}
                                    onTouchMove={(event) => TransformScale(event.touches[0].clientX, 0)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint} 
                                    onMouseDown={(event) => setClientOffset(event.clientX, event.clientX)}
                                    onMouseMove={(event) => TransformScale(event.clientX, 1)}
                                    onTouchStart={(event) => setClientOffset(event.touches[0].clientX, event.touches[0].clientY)}
                                    onTouchMove={(event) => TransformScale(event.touches[0].clientX, 1)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint}
                                    onMouseDown={(event) => setClientOffset(event.clientX, event.clientX)}
                                    onMouseMove={(event) => TransformScale(event.clientX, 0)}
                                    onTouchStart={(event) => setClientOffset(event.touches[0].clientX, event.touches[0].clientY)}
                                    onTouchMove={(event) => TransformScale(event.touches[0].clientX, 0)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint}
                                    onMouseDown={(event) => setClientOffset(event.clientX, event.clientX)}
                                    onMouseMove={(event) => TransformScale(event.clientX, 1)}
                                    onTouchStart={(event) => setClientOffset(event.touches[0].clientX, event.touches[0].clientY)}
                                    onTouchMove={(event) => TransformScale(event.touches[0].clientX, 1)}
                                ></div>
                                <div 
                                    className={styles.circle}
                                    onMouseUp={() => clientOffsetRecovery()}
                                    onMouseLeave={() => clientOffsetRecovery()}
                                    onMouseDown={(event) => setClientOffset(event.clientX, event.clientY)}
                                    onMouseMove={(event) => MoveArea(event.clientX, event.clientY)}
                                    onTouchStart={(event) => setClientOffset(event.touches[0].clientX, event.touches[0].clientY)}
                                    onTouchMove={(event) => MoveArea(event.touches[0].clientX, event.touches[0].clientY)}
                                ></div>
                            </div>
                            <div className={styles.right}></div>
                        </div>
                        <div className={styles.bottom}></div>
                    </div>
                    <img src={image} className={styles.image} draggable="false" />
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={styles.navigation}>
                    <Back onClick={() => props.setPrevOperation(false)} />
                    <Next onClick={() => setCropState(true)}/>
                </div>
            </div>
        </PopUpWindow>
    );
};

export default Crop;