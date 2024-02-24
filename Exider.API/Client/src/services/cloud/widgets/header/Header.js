import React from 'react';
import styles from './styles/main.module.css';
import search from './images/search.png';
import notifications from './images/notifications.png';
import add from './images/add.png';

const Header = () => {

    return (

        <>
            <div className={styles.search}>
                <img src={search} draggable={false} />
                <input placeholder='Search' />
            </div>
            <div className={styles.header}>
                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <img src={add} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div className={styles.button}>
                        <img src={notifications} className={styles.buttonImage} draggable='false' />
                    </div>
                    <div className={styles.button}>
                        <img src='https://e0.pxfuel.com/wallpapers/413/586/desktop-wallpaper-mathilda.jpg' draggable='false' className={styles.avatar} />
                    </div>
                </div>
            </div>
        </>
        
    );

};

export default Header;