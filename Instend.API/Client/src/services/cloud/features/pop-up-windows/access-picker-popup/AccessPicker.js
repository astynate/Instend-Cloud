import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './main.module.css'
import copy from './images/copy.png';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton';
import Select from '../../../ui-kit/fields/select/Select';
import InviteAccounts from './items/invite-accounts/InviteAccounts';

const AccessPicker = ({access, setAccess, close = () => {}, callback = () => {}}) => {
    const [isCopyInfoOpen, setCopyInfoState] = useState(false);
    const [isCopied, setCopiedState] = useState(false);
    const params = useParams();

    return (
        <PopUpWindow
            open={true} 
            close={close}
            title={"Manage access"}
        >
            <div className={styles.accessPicker}>
                <div className={styles.items}>    
                    <div className={styles.paddings}>
                        <h1 className={styles.title}>People who have access</h1>
                        <span className={styles.description}>Sometimes this setting can be changed automatically, for example when you share this item in chats.</span>
                        <br />
                        <Select 
                            value={access}
                            setValue={setAccess}
                            options={[
                                {label: "Only you", value: 0},
                                {label: "Invited users", value: 1},
                                {label: "Selected chats and Invited users", value: 2},
                                {label: "Anyone with a link", value: 3},
                            ]}
                        />
                    </div>
                    <InviteAccounts />
                </div>
                <div className={styles.footer}>
                    <div className={styles.copyWrapper}>
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
                            <span>Copy link</span>
                        </div>
                    </div>
                    <UnitedButton 
                        buttons={[
                            { label: "Cancel" },
                            { label: "Save" },
                        ]}
                    />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default AccessPicker;
