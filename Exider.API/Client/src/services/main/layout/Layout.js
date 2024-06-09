import React, { useLayoutEffect } from "react";
import styles from './main.module.css';
import background from './images/background.png';
import Header from "../../accounts/widgets/header/Header";
import { Helmet } from "react-helmet";
import logo from './images/logo.png';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userState from "../../../states/user-state";

const Layout = () => {
    const { t } = useTranslation();

    useLayoutEffect(() => {
        document.getElementById('root').className = 'light-mode';
        localStorage.setItem('color-mode', 'light-mode');
    }, []);

    return (
        <div className={styles.main}>
            <Header name={'Service'}/>
            <Helmet>
                <title>Yexider Main</title>
            </Helmet>
            <img className={styles.background} src={background} draggable="false" />
            <div className={styles.content}>
                <img className={styles.logo} src={logo} />
                <h1 className={styles.title}>Yexider — The best place for your memories.</h1>
                <p className={styles.information}>Access your data from anywhere in the world. Chat with friends and find like-minded people in communities.</p>
                <div className={styles.buttons}>
                    <Link to={userState.isAuthorize ? '/' : '/account/login'} className={styles.button}>Log in</Link>
                    <Link to='/support' className={styles.button} id="sub">Support</Link>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default Layout;