import React, { useLayoutEffect } from "react";
import styles from './main.module.css';
import Header from "../../accounts/widgets/header/Header";
import { Helmet } from "react-helmet";
import support from './images/support.png';
import Menu from "../widgets/menu/Menu";
import Cloud from "../pages/cloud/Cloud";
import Messages from "../pages/messages/Messages";
import Footer from "../../accounts/widgets/footer/Footer";

const Support = () => {
    useLayoutEffect(() => {
        document.getElementById('root').className = 'light-mode';
        localStorage.setItem('color-mode', 'light-mode');
    }, []);

    return (
        <div className={styles.main}>
            <Header name={'Support'}/>
            <Helmet>
                <title>Yexider Support</title>
            </Helmet>
            <div className={styles.content}>
                {/* <img src={support} className={styles.mainImage} draggable="false" /> */}
                <h1 className={styles.title}>Yexider Technical Support</h1>
                <h2 className={styles.subTitle}>Help system, additional information and user manual.</h2>
                <div className={styles.menuWrapper}>
                    <Menu 
                        items={[
                            {title: "Cloud", element: <Cloud />},
                            {title: "Messages", element: <Messages />},
                            {title: "Account", element: <Cloud />},
                            {title: "Terms of use", element: <Cloud />},
                        ]}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Support;