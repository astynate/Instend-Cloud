import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import styles from './main.module.css';
import background from './images/background.png';
import Header from "../../accounts/widgets/header/Header";
import logo from './images/logo.png';
import AccountState from "../../../state/entities/AccountState";

const Layout = () => {
    useLayoutEffect(() => {
        document.getElementById('root').className = 'light-mode';
        localStorage.setItem('color-mode', 'light-mode');
    }, []);

    return (
        <div className={styles.main}>
            <Header name={'Service'}/>
            <title>Instend Main</title>
            <img className={styles.background} src={background} draggable="false" />
            <div className={styles.content}>
                <img className={styles.logo} src={logo} draggable="false" />
                <h1 className={styles.title}>Instend Cloud</h1>
                <p className={styles.information}>Access your data from anywhere in the world. Chat with your friends and develop your personal profile.</p>
                <div className={styles.buttons}>
                    <Link to={AccountState.isAuthorize ? '/' : '/account/login'} className={styles.button}>Log in</Link>
                    <Link to='/support' className={styles.button} id="sub">Support</Link>
                </div>
            </div>
        </div>
    );
}

export default Layout;