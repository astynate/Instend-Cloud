import React from 'react';
import styles from './main.module.css';

const CreateItemsListPopUp = ({isOpen, items = []}) => {
    return (
        <div className={styles.wrapper} id={isOpen ? 'open' : null}>
            {items.map((element, index) => {
                if (element.type === 'upload') {
                    return (
                        <div className={styles.item} key={index}>
                            <input 
                                type="file" 
                                onInput={async (event) => await element.sendFiles(event)}
                                multiple
                            />
                            <img src={element.image} draggable="false" />
                            <span>{element.title}</span>
                        </div>
                    );
                }
                    
                return (
                    <div className={styles.item} onClick={element.callback} key={index}>
                        <img src={element.image} draggable={false} />
                        <span>{element.title}</span>
                    </div>
                );
            })}
        </div>
    );
 };

export default CreateItemsListPopUp;