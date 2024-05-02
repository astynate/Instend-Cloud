import React, { useEffect, useState } from 'react';
import styles from './main.module.css';

const SelectBox = (props) => {
    const [startPosition, setStartPosition] = useState([0, 0]);
    const [endPosition, setEndPosition] = useState([0, 0]);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (event) => {
        const except = props.selectPlace.map(element => element.current);

        if (except && except.includes && except.includes(event.target) === true) {
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
        window.addEventListener('mousedown', startDrawing);
        window.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', endDrawing);

        return () => {
            try {
                window.removeEventListener('mousedown', startDrawing);
                window.removeEventListener('mousemove', draw);
                window.removeEventListener('mouseup', endDrawing);
            } catch (error) {
                console.warn(error);
            }
        };
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
