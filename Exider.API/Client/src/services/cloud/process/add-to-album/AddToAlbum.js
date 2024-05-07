import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import Button from '../../shared/ui-kit/button/Button';
import add from './images/add.png';
import Search from '../../shared/pop-up-window/elements/search/Search';
import CheckMark from '../../shared/ui-kit/check-mark/CheckMark';
import { observer } from 'mobx-react-lite';
import { ConvertDate } from '../../../../utils/DateHandler';

const AddToAlbum = observer((props) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const AddToSelected = (item) => {
        setSelectedItems(prev => prev = [...prev, item]);
    }

    const RemoveFromSelected = (item) => {
        setSelectedItems(prev => prev = prev.filter(element => element.id !== item.id));
    }

    const isExist = (item) => {
        return selectedItems.map(element => element.id).includes(item.id);
    }

    const Select = (item) => {
        // if (isExist(item) === false) {
        //     AddToSelected(item);
        // } else {
        //     RemoveFromSelected(item);
        // }

        setSelectedItems([item])
    }

    return (
        <PopUpWindow
            open={props.open} 
            close={props.close}
            isHeaderless={false}
            title={"Add to album"}
        >
            <div className={styles.addToAlbum}>
                <div className={styles.header}>
                    <Search 
                        isLoading={false}
                        setSearchResult={() => {}}
                        setLoadingState={() => {}}
                        setSearchingState={() => {}}
                        GetData={() => {}}
                    />
                    <div className={styles.controlPanel}>
                        <span className={styles.name}>Choose album</span>
                        {/* <div className={styles.button}>
                            <img 
                                src={add}
                                draggable="false"
                                className={styles.buttonImage} 
                            />
                            <span>Create new</span>
                        </div> */}
                    </div>
                </div>
                <div className={styles.content}>
                    {props.albums && Object.entries(props.albums).map(([key, value]) => {
                            return (
                                <div 
                                    className={styles.album} 
                                    onClick={() => Select(value)}
                                    key={value.id}
                                >
                                    <img 
                                        className={styles.albumImage}
                                        src={`data:image/png;base64,${value.cover}`}
                                    />
                                    <div className={styles.information}>
                                        <span className={styles.name}>{value.name}</span>
                                        <span className={styles.date}>{ConvertDate(value.creationTime)}</span>
                                    </div>
                                    <div className={styles.right}>
                                        <CheckMark isActive={isExist(value)} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.footer}>
                    <Button 
                        value="Continue" 
                        callback={() => props.add(selectedItems[0])}
                    />
                </div>
            </div>   
        </PopUpWindow>
    );
});

export default AddToAlbum;