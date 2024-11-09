import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import SimpleButton from '../simple-button/SimpleButton';
import open from './images/open.png';
import check from './images/check.png';

const SelectItems = (props) => {
    const [isOpen, setOpenState] = useState(false);
    const wrapper = useRef();

    const closeWindow = (event) => {
        if (wrapper.current && !wrapper.current.contains(event.target)) {
            setOpenState(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', closeWindow);

        return () => {
            window.removeEventListener('click', closeWindow)
        }
    }, [])

    return (
        <div className={styles.selectWrapper} ref={wrapper}>
            <div className={styles.selectTitle} onClick={() => setOpenState(prev => !prev)}>
                <SimpleButton 
                    icon={props.icon}
                />
                <img 
                    src={open} 
                    className={styles.open}
                    id={isOpen === true ? 'open' : 'close'}
                />
            </div>
            {isOpen && <div className={styles.popUpSelect}>
                {props.items && props.items.map((list, index) => {
                    return (
                        <div className={styles.listItems} key={index}>
                            {list && list.map((item, i) => {
                                return (
                                    <div 
                                        className={styles.item} 
                                        id={item.isSelected === true ? 'active' : 'passive'}
                                        key={i}
                                        onClick={() => {
                                            props.states[index](prev => {
                                                return prev.map((element, k) => {
                                                    element.isSelected = k === i;
                                                    return element;
                                                });
                                            });

                                            setOpenState(false);
                                        }}
                                    >
                                        <img src={check} className={styles.check} />
                                        <span key={i}>{item.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>}
        </div>
    );
};

export default SelectItems;