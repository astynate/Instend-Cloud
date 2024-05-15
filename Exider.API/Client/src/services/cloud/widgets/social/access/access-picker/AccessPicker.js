import React, { useState } from 'react';
import styles from './main.module.css'
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import personal from './images/personal.png';
import friends from './images/friends.png';
import link from './images/link.png';
import next from './images/next.png';
import Loader from '../../../../shared/loader/Loader';
import copy from './images/copy.png';
import { useParams } from 'react-router-dom';
import Button from '../../../../shared/ui-kit/button/Button';

const AccessPicker = (props) => {
    const [isCopyInfoOpen, setCopyInfoState] = useState(false);
    const [isCopied, setCopiedState] = useState(false);
    const params = useParams();

    return (
        <PopUpWindow 
            open={true} 
            close={props.close}
            title={"Manage access"}
        >
            <div className={styles.accessPicker}>
            {props.isLoading ?

                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>

            :
                <>    
                    <div 
                        className={styles.item} 
                        id={props.access[0] === 0 ? 'active' : ''} 
                        onClick={() => props.access[1](0)}
                    >
                        <img src={personal} className={styles.headerImage} />
                        <span className={styles.title}>Private access</span>
                        <div className={styles.select}></div>
                    </div>
                    <div 
                        className={styles.item} 
                        id={props.access[0] === 1 ? 'active' : ''} 
                        onClick={() => {
                            props.access[1](1);
                            props.next();
                        }}
                    >
                        <img src={friends} className={styles.headerImage} />
                        <span className={styles.title}>Only people which you choose</span>
                        <img src={next} className={styles.next} />
                    </div>
                    <div 
                        className={styles.item} 
                        id={props.access[0] === 2 ? 'active' : ''} 
                        onClick={() => props.access[1](2)}
                    >
                        <img src={link} className={styles.headerImage} />
                        <span className={styles.title}>Everybody who have link</span>
                        <div className={styles.select}></div>
                    </div>
                </>}
                <div className={styles.footer}>
                    <div className={styles.copyWrapper}>
                        {isCopyInfoOpen ? 
                            <span className={styles.info}>{isCopied ? "Copied" : "Copy"}</span>
                        : null}
                        <div className={styles.copy} 
                            onMouseOver={() => {
                                setCopiedState(false);
                                setCopyInfoState(true)
                            }}
                            onMouseLeave={() => setCopyInfoState(false)}
                            onClick={() => {
                                navigator.clipboard.writeText('http://localhost:44441/cloud' + params.id);
                                setCopiedState(true);
                            }}
                        >
                            <img src={copy} />
                            <span>Link</span>
                        </div>
                    </div>
                    <Button value="Save" callback={
                        async () => {
                            await props.send();
                            props.close();
                        } 
                    } />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default AccessPicker;
