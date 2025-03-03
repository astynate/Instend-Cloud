import React from 'react';
import { observer } from 'mobx-react-lite';
import { CalculateAge, ConvertYearMonthOnly } from '../../../../../../handlers/DateHandler';
import SubContentWrapper from '../../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import Data from '../../../../elements/profile/profile-data/Data';
import styles from './main.module.css';
import Username from '../../../../elements/profile/profile-username/Username';
import UserAvatar from '../../../../shared/avatars/user-avatar/UserAvatar';
import ProfileDescriptionButtons from './ProfileDescriptionButtons';

const ProfileDescription = observer(({isMobile, account}) => {
    if (!!account === false) { 
        return null;
    };

    return (
        <div className={styles.content}>
            <SubContentWrapper>
                <div className={styles.information}>
                    <UserAvatar
                        size={isMobile ? 90 : 150}
                        avatar={account.avatar}
                    />
                    <div className={styles.data}>
                        <div className={styles.username}>
                            <Username
                                username={account.nickname}
                            />
                            {isMobile === false && <ProfileDescriptionButtons account={account} />}
                        </div>
                        <Data 
                            stats={[
                                {title: 'followers', amount: account.numberOfFollowers},
                                {title: 'following', amount: account.numberOfFollowingAccounts},
                                {title: 'coins', amount: account.balance}
                            ]}
                        />
                        {isMobile === false && <div style={{display: 'flex', gridGap: '5px', flexDirection: 'column'}}>
                            <div style={{display: 'flex', gridGap: '10px'}}>
                                <h5>{account.name} {account.surname}</h5>
                                <span className={styles.paragraph}>{CalculateAge(account.dateOfBirth)} y.o.</span>
                            </div>
                            <span className={styles.paragraph}>Joined {ConvertYearMonthOnly(account.registrationDate)}</span>
                        </div>}
                    </div>
                </div>
                {isMobile && <div style={{display: 'flex', gridGap: '5px', flexDirection: 'column'}}>
                    <div style={{display: 'flex', gridGap: '10px'}}>
                        <h5>{account.name} {account.surname}</h5>
                        <span className={styles.paragraph}>{CalculateAge(account.dateOfBirth)} y.o.</span>
                    </div>
                    <span className={styles.paragraph}>Joined {ConvertYearMonthOnly(account.registrationDate)}</span>
                    <br />
                </div>}
                {isMobile && <ProfileDescriptionButtons account={account} />}
            </SubContentWrapper>
        </div>
    );
});

export default ProfileDescription;