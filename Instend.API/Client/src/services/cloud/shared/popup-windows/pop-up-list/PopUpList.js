import React from 'react';
import styles from './main.module.css';

const PopUpList = ({items, close}) => {
    return (
        <div className={styles.popUpList}>
            {items && items.map((element, index) => {
                return (
                    <div 
                        key={index}
                        className={styles.item} 
                        onClick={async () => {
                            if (element.callback) {
                                await element.callback();
                            }

                            if (close) {
                                close();
                            }
                        }}
                    >{element.title}</div>
                );
            })}
        </div>
    );
};

export default PopUpList;