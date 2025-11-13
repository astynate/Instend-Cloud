import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import styles from './main.module.css';
import Header from "../../accounts/widgets/header/Header";
import logo from './images/logo.png';
import AccountState from "../../../state/entities/AccountState";
import Footer from "../../accounts/widgets/footer/Footer";
import christianHartley from './images/items/christian-hartley.png';
import escapeFranchise from './images/items/escape-franchise.png';
import playlist from './images/items/playlist.png';
import album from './images/items/album.png';

const Layout = () => {
    useLayoutEffect(() => {
        document.getElementById('root').className = 'light-mode';
        localStorage.setItem('color-mode', 'light-mode');
    }, []);

    return (
        <>
            <div className={styles.main}>
                <Header name={'Welcome'}/>
                <title>Instend Main</title>
                <div className={styles.background}></div>
                <div className={styles.content}>
                    <img className={styles.logo} src={logo} draggable="false" />
                    <h1 className={styles.title}>Instend</h1>
                    <p className={styles.information}>The best place to store and share music, photos, documents, and even feelings with your friends. Create collections and connect with people who share your interests to exchange content and ideas.</p>
                    <div className={styles.buttons}>
                        <Link to={AccountState.isAuthorize ? '/' : '/account/login'} className={styles.blueButton}>Login</Link>
                    </div>
                    <div className={styles.items}>
                        <img src={christianHartley} className={styles.christianHartley} draggable={false} />
                        <img src={escapeFranchise} className={styles.escapeFranchise} draggable={false} />
                        <img src={playlist} className={styles.playlist} draggable={false} />
                        <img src={album} className={styles.album} draggable={false} />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Layout;