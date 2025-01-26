import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OpenAccessContext } from '../../../process/open-access/OpenAccessProcess';
import styles from './main.module.css'
import copy from './images/copy.png';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton';
import Select from '../../../ui-kit/fields/select/Select';
import InviteAccounts from './items/invite-accounts/InviteAccounts';
import SavedState from './widgets/saved-state/SavedState';
import PointsLoaderAnimation from '../../../shared/animations/points-loader-animation/PointsLoaderAnimation';

const AccessPicker = ({
        users,
        access = 0,
        isLoading = true,
        next = () => {}, 
        setAccess = () => {}, 
        close = () => {}, 
        callback = () => {}
    }) => {
        
    const [isCopyInfoOpen, setCopyInfoState] = useState(false);
    const [isCopied, setCopiedState] = useState(false);
    const context = useContext(OpenAccessContext);
    const params = useParams();

    const updateAccess = (value) => {
        context.setSavedState(false);
        setAccess(value);
    };

    return (
        <PopUpWindow
            open={true} 
            close={close}
            title={"Manage access"}
        >
            <div className={styles.accessPicker}>
                <div className={styles.items}>
                    {isLoading ?
                        <div className={styles.loader}>
                            <PointsLoaderAnimation />
                        </div>
                    :    
                        <>
                            <div className={styles.paddings}>
                                <h1 className={styles.title}>People who have access</h1>
                                <span className={styles.description}>Sometimes this setting can be changed automatically, for example when you share this item in chats.</span>
                                <br />
                                <Select 
                                    value={access}
                                    setValue={updateAccess}
                                    options={[
                                        {label: "Only you", value: 0},
                                        {label: "Invited users", value: 1},
                                        {label: "Selected chats and Invited users", value: 2},
                                        {label: "Anyone with a link", value: 3},
                                    ]}
                                />
                            </div>
                            {access === 1 && <InviteAccounts 
                               manageCallback={next}
                               users={users}
                            />}
                        </>}
                </div>
                {!context.isSaved && <SavedState state={false} />}
                <div className={styles.footer}>
                    <div className={styles.copyWrapper}>
                        <div className={styles.copy} 
                            onMouseOver={() => {
                                setCopiedState(false);
                                setCopyInfoState(true)
                            }}
                            onMouseLeave={() => setCopyInfoState(false)}
                            onClick={() => {
                                navigator.clipboard.writeText('http://localhost:44441/cloud/' + context.item.id);
                                setCopiedState(true);
                            }}
                        >
                            <img src={copy} draggable="false" />
                            <span>Copy link</span>
                        </div>
                    </div>
                    <UnitedButton
                        isAccent={true}
                        buttons={[
                            { 
                                label: <span style={{fontSize: '17px', color: 'var(--main-red-color)'}}>Cancel</span> 
                            },
                            { 
                                label: <span style={{fontSize: '17px', fontWeight: '500', color: 'var(--main-blue-color)'}}>Save</span>,
                                callback: () => callback(close)
                            },
                        ]}
                    />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default AccessPicker;
