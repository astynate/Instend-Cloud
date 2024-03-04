import React from "react";
import styles from './styles/main.module.css';
import LoaderButton from "../../shared/loader-button/LoaderButton";
import { useTranslation } from "react-i18next";

const Header = (props) => {

    const { t } = useTranslation();

    return (

        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.settingName}>
                    <h1>{props.title}</h1>
                </div>
                <div className={styles.rightButtons}>
                    <span 
                        style={{userSelect: "none"}}
                        onClick={() => props.setCancelState(true)}
                    >
                        {t('global.cancel')}
                    </span>
                    <LoaderButton 
                        title={t('global.save')}
                        state={props.state}
                        onClick={() => props.onClick()} />
                </div>
            </div>
        </div>

    );

};

export default Header;