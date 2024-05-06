import React, { useEffect, useState } from 'react';
import styles from './main.module.css';

const DragFiles = (props) => {
    const [dragging, setDragging] = useState(false);
    const [current, setCurrent] = useState(-1);

    const handleDragOver = (event) => {
        setDragging(true);
        setCurrent(-1);
        event.preventDefault();
    }

    const handleDrop = (event) => {
        if (current !== -1) {
            props.items[current].callback(event);
        }

        setDragging(false);
        setCurrent(-1);

        event.preventDefault();
    }

    const handleDragLeave = (event) => {
        if (!document.body.contains(event.relatedTarget)) {
            setDragging(false);
        }

        event.preventDefault();
    }

    useEffect(() => {
        window.addEventListener('dragenter', handleDragOver);
        window.addEventListener('dragleave', handleDragLeave);

        return () => {
            window.removeEventListener(`dragenter`, handleDragOver);
            window.removeEventListener('dragleave', handleDragLeave);
        }
    }, []);

    return (
        <div 
            className={styles.dragFile} 
            id={dragging ? 'open' : null}
        >
            {props.items.map((item, index) => {
                return (
                    <div 
                        key={index}
                        className={styles.block}
                        onDragOver={(event) => {
                            setCurrent(index);
                            event.preventDefault();
                        }}
                        onDragEnter={(event) => {event.preventDefault()}}
                        onDrop={handleDrop}
                        id={index === current ? "selected" : null}
                        // draggable="true"
                    >
                        <h1>{item.title}</h1>
                        <span>{item.decription}</span>
                    </div>
                )
            })}
        </div>
    );
};

export default DragFiles;

