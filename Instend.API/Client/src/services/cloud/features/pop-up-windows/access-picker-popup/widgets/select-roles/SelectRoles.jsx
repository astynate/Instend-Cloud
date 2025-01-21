import styles from './main.module.css';
import order from './image/order.png';
import { useState, useEffect, useRef } from 'react';

const SelectRoles = ({value, setValue = () => {}, items, isEditable = false}) => {
    const [isOpen, setOpenState] = useState(false);
    const containerRef = useRef(null);

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setOpenState(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.role} ref={containerRef}>
            <div onClick={() => setOpenState(p => !p)} className={styles.select}>
                <span className={styles.state}>{items[value]}</span>
                {isEditable && (
                    <img 
                        src={order} 
                        draggable="false" 
                    />
                )}
            </div>
            {isOpen && (
                <div className={styles.list}>
                    {items.map((item, index) => {
                        if (index === value) {
                            return null;
                        }
                        return (
                            <div 
                                key={index} 
                                className={styles.item} 
                                onClick={() => {
                                    setOpenState(false);
                                    setValue(index);
                                }}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SelectRoles;