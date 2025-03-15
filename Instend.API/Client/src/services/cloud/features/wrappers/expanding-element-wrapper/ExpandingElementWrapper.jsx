import { useRef, useState } from 'react';
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

    return (
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
    );
};

export default ExpandingElementWrapper;