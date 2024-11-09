import React, { useState } from 'react';
import styles from './main.module.css';
import SubContentWrapper from '../../../features/sub-content-wrapper/SubContentWrapper';

const MenuWithUnderline = ({items, defaultValue, rightItems}) => {
    const [current, setCurrent] = useState(defaultValue ? defaultValue : 0);

    return (
        <>
            <div className={styles.localMenuWrapper}>
                <SubContentWrapper>
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
                            {rightItems && rightItems.map((element, index) => {
                                return (
                                    React.cloneElement(element, { key: `element-${index}` })
                                );
                            })}
                        </div>
                    </div>
                </SubContentWrapper>
            </div>
            <SubContentWrapper>
                {items && items.map && items.map((element, index) => {
                    if (element.component && index === current) {
                        return (
                            <div className={styles.wrapper} key={index}>
                                {(element.component)}
                            </div>
                        );
                    }

                    return null;
                })}
            </SubContentWrapper>
        </>
    );
};

export default MenuWithUnderline;