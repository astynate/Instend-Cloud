import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CalculateAge, ConvertYearMonthOnly } from '../../../../../../handlers/DateHandler';
import SubContentWrapper from '../../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import Data from '../../../../elements/profile/profile-data/Data';
import styles from './main.module.css';
import Username from '../../../../elements/profile/profile-username/Username';
import CircleButtonWrapper from '../../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper';
import UserAvatar from '../../../../shared/avatars/user-avatar/UserAvatar';
import AccountState from '../../../../../../state/entities/AccountState';
import FollowersController from '../../../../../../api/FollowersController';

const ProfileDescription = observer(({isMobile, account}) => {
    const { t } = useTranslation();

    if (!!account === false) { 
        return null;
    }

    return (
        <div className={styles.content}>
            <SubContentWrapper>
                <div className={styles.information}>
                    <UserAvatar
                        size={150}
                        avatar={account.avatar}
                    />
                    <div className={styles.data}>
                        <div className={styles.username}>
                            <Username
                                username={account.nickname}
                            />
                            <div className={styles.buttons}>
                                {account.id === AccountState.account.id ?
                                    <Link to={'/settings/profile'}>
                                        <CircleButtonWrapper widthPaddings={20} heightPaddings={7}>
                                            <span className={styles.buttonText}>Edit profile</span>
                                        </CircleButtonWrapper>
                                    </Link>
                                : 
                                    <div style={{display: 'flex', gridGap: '10px'}}>
                                        <div onClick={() => FollowersController.Follow(account.id)}>
                                            <CircleButtonWrapper isAccent={!AccountState.IsAccountInTheListOfFollowingAcounts(account.id)} widthPaddings={20} heightPaddings={7}>
                                                <span className={styles.buttonText}>{!AccountState.IsAccountInTheListOfFollowingAcounts(account.id) ? 'Follow' : 'Unfollow'}</span>
                                            </CircleButtonWrapper>
                                        </div>
                                        <Link to={'/settings/profile'}>
                                            <CircleButtonWrapper widthPaddings={20} heightPaddings={7}>
                                                <span className={styles.buttonText}>Message</span>
                                            </CircleButtonWrapper>
                                        </Link>
                                    </div>
                                }
                            </div>
                        </div>
                        <Data 
                            stats={[
                                {title: 'followers', amount: account.numberOfFollowers},
                                {title: 'following', amount: account.numberOfFollowingAccounts},
                                {title: 'coins', amount: account.balance}
                            ]}
                        />
                        <div style={{display: 'flex', gridGap: '5px', flexDirection: 'column'}}>
                            <div style={{display: 'flex', gridGap: '10px'}}>
                                <h5>{account.name} {account.surname}</h5>
                                <span className={styles.paragraph}>{CalculateAge(account.dateOfBirth)} y.o.</span>
                            </div>
                            <span className={styles.paragraph}>Joined {ConvertYearMonthOnly(account.registrationDate)}</span>
                        </div>
                    </div>
                </div>
            </SubContentWrapper>
        </div>
    );
});

export default ProfileDescription;