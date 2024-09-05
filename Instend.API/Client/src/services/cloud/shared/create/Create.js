import React from 'react';
import styles from './styles/main.module.css';

const Create = (props) => {
    return (
        <div className={styles.wrapper} id={props.isOpen ? 'open' : null}>
            {props && props.items && props.items.map((element, index) => {
                if (element.type === 'upload') {
                    return (
                        <div className={styles.item} key={index}>
                            <input 
                                type="file" 
                                onInput={async (event) => await element.sendFiles(event)}
                                multiple
                            />
                            <img src={element.image} />
                            <span>{element.title}</span>
                        </div>
                    );
                } else {
                    return (
                        <div className={styles.item} onClick={element.callback} key={index}>
                            <img src={element.image} draggable={false} />
                            <span>{element.title}</span>
                        </div>
                    );
                }
            })}
        </div>
    );
 };

export default Create;