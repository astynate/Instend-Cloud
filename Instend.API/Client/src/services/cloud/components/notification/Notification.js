import React from 'react';
import styles from './main.module.css';
import { observer } from 'mobx-react-lite';
import BurgerMenu from '../../ui-kit/burger-menu/BurgerMenu';

const Notification = observer(({isLoading, avatar, title, text, items}) => {
  return (
    <div className={styles.notification} id={isLoading ? 'loading' : null}>
        <div className={styles.unread}>
            <div className={styles.point}></div>
        </div>
        <div className={styles.avatar}>
            {avatar && <img src={`data:image/png;base64,${avatar}`} draggable="false" />}
        </div>
        <div className={styles.information}>
            {title ? 
                <h3 className={styles.title}>{title}</h3>
            :
                <div className={styles.titlePlaceholder}></div>
            }
            {!isLoading ? 
                <span className={styles.text}>{text}</span>
            :
                <>
                    <div className={styles.textPlaceholder}></div>
                    <div className={styles.textPlaceholder}></div>
                </>
            }
        </div>
        <div className={styles.control}>
            {!isLoading && <BurgerMenu 
                items={items}
            />}
        </div>
    </div>
  )
});

export default Notification;