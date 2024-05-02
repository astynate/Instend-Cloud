import React, { useEffect, useState } from 'react';
import styles from './main.module.css';

const SelectBox = (props) => {
    const [startPosition, setStartPosition] = useState([0, 0]);
    const [endPosition, setEndPosition] = useState([0, 0]);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (event) => {
        if (event.target === props.selectPlace.current) {
            setIsDrawing(true);
            setStartPosition([event.clientX, event.clientY]);
        }
    };

    const draw = (event) => {
        setEndPosition([event.clientX, event.clientY]);
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    useEffect(() => {
        try {
            props.selectPlace.current.addEventListener('mousedown', startDrawing);
            props.selectPlace.current.addEventListener('mousemove', draw);
            window.addEventListener('mouseup', endDrawing);
    
            return () => {
                props.selectPlace.current.removeEventListener('mousedown', startDrawing);
                props.selectPlace.current.removeEventListener('mousemove', draw);
                window.current.removeEventListener('mouseup', endDrawing);
            };
        } catch (error) {
            console.warn(error)
        }
    }, []);

    return (
        <div className={styles.selectBox} style={{
            left: Math.min(startPosition[0], endPosition[0]),
            top: Math.min(startPosition[1], endPosition[1]),
            width: Math.abs(startPosition[0] - endPosition[0]),
            height: Math.abs(startPosition[1] - endPosition[1]),
            display: isDrawing ? 'flex' : 'none',
            position: 'fixed',
            background: `rgba(209, 209, 209, 0.2)`,
            border: `1px solid rgba(232, 232, 232, 0.5)`
        }} />
    );
};

export default SelectBox;
