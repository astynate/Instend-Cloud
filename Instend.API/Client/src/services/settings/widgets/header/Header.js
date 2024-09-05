import React from "react";
import styles from './styles/main.module.css';
import LoaderButton from "../../shared/loader-button/LoaderButton";
import { useTranslation } from "react-i18next";
import back from './images/back.png';
import { useNavigate } from "react-router-dom";

const Header = (props) => {

    const { t } = useTranslation();
    const navigation = useNavigate();

    return (

        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                {

                    props.isMobile ? 

                        <img src={back} className={styles.back} onClick={() => navigation('/settings')} /> 

                    : null

                }
                <div className={styles.settingName} onClick={() => navigation('/settings')}>
                    <h1>{props.isMobile ? t('cloud.settings.profile.back') : props.title}</h1>
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