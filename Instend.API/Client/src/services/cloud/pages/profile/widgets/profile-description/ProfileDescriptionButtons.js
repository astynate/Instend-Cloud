import React from 'react';
import { Link } from "react-router-dom";
import styles from './main.module.css';
import AccountState from "../../../../../../state/entities/AccountState";
import CircleButtonWrapper from "../../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper";
import FollowersController from "../../../../../../api/FollowersController";

const ProfileDescriptionButtons = ({account}) => {
    return (
        <div className={styles.buttons}>
            {account.id === AccountState.account.id ?
                <Link to={'/settings/profile'}>
                    <CircleButtonWrapper isFullSize={true} widthPaddings={20} heightPaddings={7}>
                        <span className={styles.buttonText}>Edit profile</span>
                    </CircleButtonWrapper>
                </Link>
            : 
                <div style={{display: 'flex', gridGap: '10px'}}>
                    <div onClick={() => FollowersController.Follow(account.id)}>
                        <CircleButtonWrapper isFullSize={true} isAccent={!AccountState.IsAccountInTheListOfFollowingAcounts(account.id)} widthPaddings={20} heightPaddings={7}>
                            <span className={styles.buttonText}>{!AccountState.IsAccountInTheListOfFollowingAcounts(account.id) ? 'Follow' : 'Unfollow'}</span>
                        </CircleButtonWrapper>
                    </div>
                    <Link to={'/settings/profile'}>
                        <CircleButtonWrapper isFullSize={true} widthPaddings={20} heightPaddings={7}>
                            <span className={styles.buttonText}>Message</span>
                        </CircleButtonWrapper>
                    </Link>
                </div>
            }
        </div>
    );
};

export default ProfileDescriptionButtons;