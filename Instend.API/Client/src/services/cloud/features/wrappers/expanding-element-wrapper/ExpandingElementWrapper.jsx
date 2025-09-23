import { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const ExpandingElementWrapper = ({ targetWidth = 500, targetHeight = 500, children }) => {
    const elementRef = useRef(null);
    const [dimensions, setDimensions] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    const updateDimensions = () => {
        if (elementRef.current) {
            const { top, left, height, width } = elementRef.current.getBoundingClientRect();
            
            setDimensions({
                offsetTop: top,
                offsetLeft: left,
                height,
                width
            });
        }
    };

    const handleClick = () => {
        updateDimensions();
        setIsExpanded(true);
    };

    const handleClickOutside = (event) => {
        if (!elementRef.current || elementRef.current.contains(event.target)) {
            return false;
        };

        if (!isExpanded) {
            return false;
        };

        setIsExpanded(false);

        setDimensions({
            offsetTop: 0,
            offsetLeft: 0,
            height: '100%',
            width: '100%'
        });
    };

    return (
        <div 
            className={styles.wrapper}
            style={{
                top: isExpanded ? '0%' : `${dimensions.offsetTop}px`,
                left: isExpanded ? '0%' : `${dimensions.offsetLeft}px`,
                height: isExpanded ? '100svh' : dimensions.height,
                width: isExpanded ? '100dvw' : dimensions.width,
                position: isExpanded ? 'fixed' : 'absolute',
                opacity: isExpanded ? '1' : '0',
                transition: 'all 0.5s ease'
            }}
            onClick={handleClickOutside}
        >
            <div 
                ref={elementRef} 
                className={`${styles.expandingElement} ${isExpanded ? styles.expanded : ''}`}
                onClick={handleClick}
                style={{
                    top: isExpanded ? '50%' : `${dimensions.offsetTop}px`,
                    left: isExpanded ? '50%' : `${dimensions.offsetLeft}px`,
                    height: isExpanded ? targetHeight : dimensions.height,
                    width: isExpanded ? targetWidth : dimensions.width,
                    transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
                    position: isExpanded ? 'fixed' : 'absolute',
                    opacity: isExpanded ? '1' : '0',
                    transition: 'all 0.5s ease'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ExpandingElementWrapper;