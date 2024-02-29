import React, { useContext, useEffect, useRef, useState } from "react";
import styles from './styles/main.module.css';
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import { ProfileSettingsContext } from "../../Profile";
import { Back, Next } from "../../../../shared/navigate/Navigate";

const Crop = (props) => {

    const wrapperRef = useRef();
    const [isMouseDown, setMouseDown] = useState(false);
    const [context, setContext] = useContext(ProfileSettingsContext);
    const [image, setImage] = useState();
    const [offsetTop, setOffsetTop] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const [areaHeight, setAreaHeight] = useState(300);
    const [areaWidth, setAreaWidth] = useState(300);
    const [imageSize, setImageSize] = useState([0, 0]);
    const [objectFit, setObjectFit] = useState('width');
    const [currentOffestX, setCurrentOffsetX] = useState(0);
    const [currentOffestY, setCurrentOffsetY] = useState(0);

    useEffect(() => {

        setOffsetTop(getComputedStyle(wrapperRef.current)
            .getPropertyValue('--top').replace('px', ''));

        setOffsetLeft(getComputedStyle(wrapperRef.current)
            .getPropertyValue('--left').replace('px', ''));

    }, [offsetTop, offsetLeft]);

    useEffect(() => {

        const file = context.avatar.image;
        const reader = new FileReader();
    
        reader.onload = (event) => {

            const image = new Image();
            image.src = event.target.result;

            image.onload = () => {

                const height = image.naturalHeight;
                const width = image.naturalWidth;

                setImageSize([height, width]);

                if (height >= width) {

                    const aspectRatio = 450 / height;

                    setAreaHeight(width * aspectRatio);
                    setAreaWidth(width * aspectRatio);
                    setObjectFit('height');

                } else {

                    const aspectRatio = 600 / width;

                    setAreaHeight(height * aspectRatio);
                    setAreaWidth(height * aspectRatio);
                    setObjectFit('width');

                }

            };

            if (event.target.result) {
                setImage(event.target.result);
            }
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    
    }, [context.avatar.image]);
    

    const setClientOffset = (event) => {

        setClientX(event.clientX);
        setClientY(event.clientY);
        setMouseDown(true);

    };

    const clientOffsetRecovery = () => {

        setMouseDown(false);
        setCurrentOffsetX(offsetLeft);
        setCurrentOffsetY(offsetTop);
        setClientX(0);
        setClientY(0);

    };

    const MoveArea = (event) => {

        if (isMouseDown) {

            const offsetY = event.clientY - clientY + parseInt(currentOffestY);
            const offsetX = event.clientX - clientX + parseInt(currentOffestX);

            if (objectFit === 'height') {

                if (offsetY + areaHeight < 450) {
                    setOffsetTop(parseInt(offsetY <= 0 ? 1 : offsetY));
                }

                if (offsetX + areaWidth < 450 / imageSize[0] * imageSize[1]) {
                    setOffsetLeft(parseInt(offsetX <= 0 ? 1 : offsetX));
                }

            } else {
              
                if (offsetY + areaHeight < 600 / imageSize[1] * imageSize[0]) {
                    setOffsetTop(parseInt(offsetY <= 0 ? 1 : offsetY));
                }

                if (offsetX + areaWidth < 600) {
                    setOffsetLeft(parseInt(offsetX <= 0 ? 1 : offsetX));
                }

            }

        }

    };

    const TransformScale = (event, type) => {

        if (isMouseDown) {

            const offset = event.clientX - clientX;

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
            setAreaWidth(areaWidth - size);
            setOffsetTop(prev => parseInt(prev) + size / 2);
            setOffsetLeft(prev => parseInt(prev) + size / 2);

        }

    };

    const Icrease = (size) => {

        let MAX_HEIGHT = objectFit === 'height' ? 450 : 600 / imageSize[1] * imageSize[0];
        let MAX_WIDTH = objectFit === 'width' ? 600 : 450 / imageSize[0] * imageSize[1];

        if (areaHeight + size < MAX_HEIGHT && areaWidth + size < MAX_WIDTH) {

            setAreaHeight(areaHeight + size);
            setAreaWidth(areaWidth + size);
            setOffsetTop(prev => parseInt(prev) - size / 2);
            setOffsetLeft(prev => parseInt(prev) - size / 2);

        }

    };

    const Submit = () => {

        props.setOpenState(false);
        props.setAvatar(image);

    }

    return (

        <PopUpWindow isOpen={props.isOpen} setOpenState={props.setOpenState}>
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
                                    onMouseDown={(event) => setClientOffset(event)}
                                    onMouseMove={(event) => TransformScale(event, 0)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint} 
                                    onMouseDown={(event) => setClientOffset(event)}
                                    onMouseMove={(event) => TransformScale(event, 1)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint}
                                    onMouseDown={(event) => setClientOffset(event)}
                                    onMouseMove={(event) => TransformScale(event, 0)}
                                ></div>
                                <div 
                                    className={styles.dragAndDropPoint}
                                    onMouseDown={(event) => setClientOffset(event)}
                                    onMouseMove={(event) => TransformScale(event, 1)}
                                ></div>
                                <div 
                                    className={styles.circle}
                                    onMouseUp={() => clientOffsetRecovery()}
                                    onMouseLeave={() => clientOffsetRecovery()}
                                    onMouseDown={(event) => setClientOffset(event)}
                                    onMouseMove={(event) => MoveArea(event)}
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
                    <Back />
                    <Next onClick={() => Submit()}/>
                </div>
            </div>
        </PopUpWindow>

    );

};

export default Crop;