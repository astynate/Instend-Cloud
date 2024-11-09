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
    const [isMutiple, setMultipleState] = useState(false);
    const target = useRef();

    const FilterItems = () => {
        const items = props.items.map(e => e.id);

        props.activeItems[1](prev => {
            return prev.filter(element => items.includes(element.id) === true);
        });
    }

    useEffect(() => {
        setMultipleState(props.selectedItems[0].length > 1);

        if (props.selectedItems[0].length > 0) {
            let uniqueItems = Array.from(new Set(props.selectedItems[0]));

            uniqueItems = uniqueItems.filter(element => props.items.map(e => e.id).includes(element.id));
            props.activeItems[1](uniqueItems);
        }

        FilterItems();
    }, [props.items, props.selectedItems[0], props.selectedItems[0].length]);    

    const isElementExist = (id) => {
        if (props.selectedItems[0] && props.selectedItems[0].map) {
            return props.selectedItems[0].map(element => element.id)
                .includes(id) === true;
        }

        return true;
    }

    const getElementById = (id) => {
        if (props.items && id) {
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

        if (props.items && id) {
            setContextMenuState(true);
            setContextMenuPosition([event.clientX, event.clientY]);
    
            const element = getElementById(id);
    
            if (isElementExist(id) === false && element !== null) {
                props.selectedItems[1](prev => [...prev, element]);
            }   
        }
    }

    const HandleClick = (event, id) => {
        if (event.shiftKey || event.ctrlKey) {
            event.preventDefault();
        }

        if (props.items && id && getElementById(id)) {
            if (event.ctrlKey && isElementExist(id) === false) {
                props.selectedItems[1](prev => [...prev, getElementById(id)]);
            } else if (event.ctrlKey && isElementExist(id) === true) {
                props.selectedItems[1](prev => prev.filter(element => element.id !== id));
            }

            if (event.shiftKey && props.selectedItems[0].length > 0) {
                const { selectedItems, items } = props;
                const updateSelectedItems = selectedItems[1];
                
                const lastItem = selectedItems[0][selectedItems[0].length - 1];
                const indexInItems = items.findIndex(element => element.id === lastItem.id);
                const selectedIndex = items.findIndex(element => element.id === id);
                
                const start = Math.min(indexInItems, selectedIndex);
                const end = Math.max(indexInItems, selectedIndex);
                
                for (let i = start; i < end; i++) {
                    updateSelectedItems(prev => [...prev, items[i]]);
                }      
            } 
            
            if (event.shiftKey) {
                props.selectedItems[1](prev => [...prev, getElementById(id)]);
            }
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
    }, [props.items, props.items.length, props.selectedItems[0], props.selectedItems[0].length]);

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
                    items={isMutiple ? props.multiple : props.single} 
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
