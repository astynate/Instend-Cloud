import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from './styles/main.module.css';
import LoaderButton from "../../shared/loader-button/LoaderButton";
import back from './images/back.png';

const Header = (props) => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                {props.isMobile && 
                    <img src={back} className={styles.back} onClick={() => navigation('/settings')} />}
                <div className={styles.settingName} onClick={() => navigation('/settings')}>
                    <h1>{props.isMobile ? t('cloud.settings.profile.back') : props.title}</h1>
                </div>
                <div className={styles.rightButtons}>
                    <LoaderButton 
                        title={t('global.save')}
                        state={props.state}
                        onClick={() => props.onClick()} 
                    />
                    <span 
                        style={{userSelect: "none"}}
                        className={styles.secondButton}
                        onClick={() => props.setCancelState(true)}
                    >
                        {t('global.cancel')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Header;