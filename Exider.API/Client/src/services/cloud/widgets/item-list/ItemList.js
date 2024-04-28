import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import storageState, { AdaptId } from '../../../../states/storage-state';
import { toJS } from 'mobx';

const ItemList = observer((props) => {
    const elementsWrapper = useRef();

    useEffect(() => {
        const element = elementsWrapper.current;
        element.scrollLeft = element.scrollWidth;
    }, [props.id]);

    const CalculateAverageEqual = (a, b, offest) => {
        return b < a + offest && b > a - offest;
    }

    const handleScroll = () => {
        const element = elementsWrapper.current;
        const children = Array.from(element.children);
        
        children.map(async (item) => {
            item.id = 'passive';
    
            if (CalculateAverageEqual(item.offsetLeft + 25, element.scrollLeft + (element.clientWidth / 2), 25)) {
                item.id = 'active';
                
                if (storageState.files[props.id]) {
                    let fileObject = await storageState.files[props.id]
                        .find(x => x.id === item.dataset.id);
    
                    if (fileObject && fileObject.fileAsBytes) {
                        await props.setActive(fileObject);
                    }
                }
            }
    
            return item;
        });
    };
    
    return (
        <>
            <div ref={elementsWrapper} className={styles.itemList} onScroll={handleScroll}>
                {storageState.files[AdaptId(props.id)] && 
                    [...toJS(storageState.files[AdaptId(props.id)])]
                        .sort((a, b) => a.id === props.current ? 1 : -1)
                        .map((element) => {
                            return (
                                <div key={element.id} data-id={element.id} id={element.id === props.id ? 'active' : null} className={styles.itemWrapper}>
                                    {element.fileAsBytes ? (
                                        <div className={styles.item}>
                                            <img 
                                                src={`data:image/png;base64,${element.fileAsBytes}`} 
                                                draggable='false'
                                            />
                                        </div>
                                    ) 
                                    :
                                        <div className={styles.item} id="no-type">
                                            <span>{element.type}</span>
                                        </div>}
                                </div>
                            )
                        })}
                </div>
            <div className={styles.point}></div>
        </>
    );
});

export default ItemList;