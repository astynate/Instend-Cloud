import React, { useState } from 'react';
import styles from './main.module.css';
import MainContentWrapper from '../../../features/main-content-wrapper/MainContentWrapper';

const LocalMenu = ({items, defaultValue, rightItems}) => {
    const [current, setCurrent] = useState(defaultValue ? defaultValue : 0);

    return (
        <>
            <div className={styles.localMenuWrapper}>
                <MainContentWrapper>
                    <div className={styles.localMenu}>
                        <div className={styles.menuItems}>
                            {items && items.map && items.map((element, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className={styles.item} 
                                        id={index === current ? 'active' : null}
                                        onClick={() => setCurrent(index)}
                                    >
                                        <span>{element.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={styles.right}>
                            {rightItems && rightItems.map((element, index) => {
                                return (
                                    <div key={index}>
                                        {(element)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </MainContentWrapper>
            </div>
            <MainContentWrapper>
                {items && items.map && items.map((element, index) => {
                    if (element.component && index === current) {
                        return (
                            <div className={styles.wrapper} key={index}>
                                {(element.component)}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </MainContentWrapper>
        </>
    );
};

export default LocalMenu;