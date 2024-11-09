import styles from './main.module.css';
import checkmark from './checkmark.png';
import { useEffect } from 'react';

const SelectUIElements = ({
        isSelected = false, 
        isSelectedOpen = false, 
        setSelectedState = {}, 
        element = {},
        setSelectedFiles = {},
        top = -5,
        right = -10
    }) => {

    useEffect(() => {
        if (typeof setSelectedFiles === 'function') {
            setSelectedFiles(prev => {
                const file = prev.find(e => e.id === element.id);
                setSelectedState(!!file);
                return prev;
            });
        }
    }, []);

    if (isSelectedOpen === false && isSelected === false)
        return null;

    return (
        <div 
            className={styles.select}
            style={{top: `${top}px`, right: `${right}px`}}
            onClick={(event) => {
                if (typeof setSelectedFiles === 'function') {
                    setSelectedFiles(prev => {
                        const file = prev.find(e => e.id === element.id);

                        if (file) {
                            setSelectedState(false);
                            return prev.filter(e => e.id !== element.id);
                        } else if (prev.length < 5) {
                            setSelectedState(true);
                            return [element, ...prev];
                        }

                        return prev;
                    });
                }

                event.preventDefault();
            }}
        >
            {isSelected && <div className={styles.checkMark}>
                <img src={checkmark} draggable="false" />
            </div>}
        </div>
    );
}

export default SelectUIElements;