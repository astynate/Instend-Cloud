import React from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import Input from '../../shared/ui-kit/input/Input';
import TextArea from '../../shared/ui-kit/text-area/TextArea';
import Button from '../../shared/ui-kit/button/Button';
import image from './images/image.png';

const CommunityEditor = ({open, close}) => {
    return (
        <PopUpWindow
            open={open}
            close={close}
            title={"Create community"}
        >
            <div className={styles.communityEditor}>
                <div className={styles.field}>
                    <span>Header</span>
                    <div className={styles.header}>
                        <img 
                            src={image} 
                            className={styles.image}
                            draggable="false"
                        />
                        <input type='file' />
                    </div>
                </div>
                <div className={styles.field}>
                    <span>Avatar</span>
                    <div className={styles.avatar}>
                        <img 
                            src={image} 
                            className={styles.image}
                            draggable="false"
                        />
                        <input type='file' />
                    </div>
                </div>
                <div className={styles.field}>
                    <span>Name</span>
                    <Input 
                        placeholder="Set name"
                        setValue={() => {}}
                    />
                </div>
                <div className={styles.field}>
                    <span>Description</span>
                    <TextArea 
                        placeholder="Set description"
                        setValue={() => {}}
                    />
                </div>
                <div className={styles.field}>
                    <div className={styles.button}>
                        <Button 
                            value="Next"
                        />
                    </div>
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default CommunityEditor;