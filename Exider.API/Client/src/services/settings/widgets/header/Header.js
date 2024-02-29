import React, { useState } from "react";
import styles from './styles/main.module.css';
import LoaderButton from "../../shared/loader-button/LoaderButton";
import { instance } from "../../../../state/Interceptors";

const Header = (props) => {

    const [formState, setFormState] = useState('valid');

    const SaveChanges = async () => {

        setFormState('loading');

        await instance.get('/users');

        setFormState('valid');

    };

    return (

        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.settingName}>
                    <h1>{props.title}</h1>
                </div>
                <div className={styles.rightButtons}>
                    <span>Cancel</span>
                    <LoaderButton 
                        title='Save' 
                        state={formState}
                        onClick={() => SaveChanges()} />
                </div>
            </div>
        </div>

    );

};

export default Header;