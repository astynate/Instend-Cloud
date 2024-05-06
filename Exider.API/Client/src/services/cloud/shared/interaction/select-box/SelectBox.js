import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import ContextMenu from '../../context-menu/ContextMenu';
import { observer } from 'mobx-react-lite';

// To use corrent
// selectPlace={[wrapper]}
// selectedItems={[selectedItems, setSelectedItems]}
// activeItems={[activeItems, setActiveItems]}
// itemsWrapper={wrapper}
// items={items}
// single={single}
// multiple={multiple}
// html element need to contain item id
// in property data

const SelectBox = observer((props) => {
    const [startPosition, setStartPosition] = useState([0, 0]);
    const [endPosition, setEndPosition] = useState([0, 0]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isContextMenuOpen, setContextMenuState] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [contextMenuItems, setContextMenuItems] = useState(props.single);
    const target = useRef();

    useEffect(() => {
        if (props.selectedItems[0].length > 1) {
            setContextMenuItems(props.multiple);
        } else {
            setContextMenuItems(props.single);
        }
        
        if (props.selectedItems[0].length > 0) {
          props.activeItems[1](props.selectedItems[0]);
        }
    }, [props.activeItems, props.activeItems[0], props.selectedItems, props.selectedItems[0]]);

    const isElementExist = (id) => {
        if (props.selectedItems[0] && props.selectedItems[0].map) {
            return props.selectedItems[0].map(element => element.id)
                .includes(id) === true;
        }

        return true;
    }

    const getElementById = (id) => {
        if (props.items) {
            return props.items.find(element => element.id === id);
        }

        return null;
    }

    const ClearSelectedItems = (event) => {
        if (props.selectPlace.includes(event.target) === false && event.shiftKey === false && event.ctrlKey === false) {
            props.selectedItems[1]([]);
        }
    }

    useEffect(() => {
        window.addEventListener('click', ClearSelectedItems);

        return () => {
            window.removeEventListener('click', ClearSelectedItems);
        };
    }, []);

    const HandleContextMenu = (event, id) => {
        event.preventDefault();
        setContextMenuState(true);
        setContextMenuPosition([event.clientX, event.clientY]);

        if (isElementExist(id) === false) {
            props.selectedItems[1](prev => [...prev, getElementById(id)]);
        }
    }

    const HandleClick = (event, id) => {
        if (event.shiftKey && isElementExist(id) === false) {
            props.selectedItems[1](prev => [...prev, getElementById(id)]);
            event.preventDefault();
        } else if (event.shiftKey && isElementExist(id) === true) {
            props.selectedItems[1](prev => prev.filter(element => element.id !== id));
            event.preventDefault();
        }
    }

    useEffect(() => {
        const elements = Array.from(props.itemsWrapper.current.children);
        const eventListeners = [];
    
        for (let i = 0; i < elements.length; i++) {
            const contextMenuListener = (event) => HandleContextMenu(event, elements[i].getAttribute('data'));
            const clickListener = (event) => HandleClick(event, elements[i].getAttribute('data'));
            elements[i].addEventListener('contextmenu', contextMenuListener);
            elements[i].addEventListener('click', clickListener);
            eventListeners.push({element: elements[i], contextMenuListener, clickListener});
        }
    
        return () => {
            eventListeners.forEach(({element, contextMenuListener, clickListener}) => {
                element.removeEventListener('contextmenu', contextMenuListener);
                element.removeEventListener('click', clickListener);
            });
        };
    }, [props.itemsWrapper, props.itemsWrapper.current, props.itemsWrapper.current?.children.length, props.selectedItems[0]]);    

    const startDrawing = (event) => {
        const except = props.selectPlace.map(element => element.current);

        if (except && except.includes && except.includes(event.target) === true && !isDrawing) {
            setStartPosition([event.clientX, event.clientY]);
            setIsDrawing(() => true);
        }
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (event) => {
        setEndPosition([event.clientX, event.clientY]);
    };

    useEffect(() => {
        window.addEventListener('mousedown', startDrawing);
        window.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', () => endDrawing(isDrawing));

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
        <>
            {isContextMenuOpen === true &&
                <ContextMenu 
                    items={contextMenuItems} 
                    close={() => setContextMenuState(false)}
                    isContextMenu={true}
                    position={contextMenuPosition}
                />
            }
            <div className={styles.selectBox} ref={target} style={{
                left: Math.min(startPosition[0], endPosition[0]),
                top: Math.min(startPosition[1], endPosition[1]),
                width: Math.abs(startPosition[0] - endPosition[0]),
                height: Math.abs(startPosition[1] - endPosition[1]),
                display: isDrawing ? 'flex' : 'none',
                position: 'fixed',
                background: `rgba(209, 209, 209, 0.2)`,
                border: `1px solid rgba(232, 232, 232, 0.5)`
            }} />
        </>
    );
});

export default SelectBox;
