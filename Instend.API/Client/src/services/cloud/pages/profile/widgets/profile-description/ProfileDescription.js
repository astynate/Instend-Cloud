import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import AccountState from '../../../../../../state/entities/AccountState';
import SubContentWrapper from '../../../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import Data from '../../../../elements/profile/profile-data/Data';
import styles from './main.module.css';
import Avatar from '../../../../elements/profile/profile-avatar/Avatar';
import Username from '../../../../elements/profile/profile-username/Username';
import CircleButtonWrapper from '../../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper';
import { Link } from 'react-router-dom';

const ProfileDescription = observer(({isMobile}) => {
    const { t } = useTranslation();
    const { account } = AccountState;

    if (!!account === false) { 
        return null;
    }

    return (
        <div className={styles.content}>
            <SubContentWrapper>
                <div className={styles.information}>
                    <Avatar 
                        avatar={account.avatar}
                    />
                    <div className={styles.data}>
                        <div className={styles.username}>
                            <Username
                                username={account.nickname}
                            />
                            <div className={styles.buttons}>
                                <Link to={'/settings/profile'}>
                                    <CircleButtonWrapper widthPaddings={20} heightPaddings={8}>
                                        <span className={styles.buttonText}>Edit profile</span>
                                    </CircleButtonWrapper>
                                </Link>
                            </div>
                        </div>
                        <Data 
                            stats={[
                                {title: t('cloud.profile.coins'), amount: account.balance},
                                {title: t('cloud.profile.friends'), amount: account.friendCount},
                                {title: 'MB', amount: (account.storageSpace / (1024 * 1024)).toFixed(0)}
                            ]}
                        />
                        <h5>{account.name} {account.surname}</h5>
                    </div>
                </div>
            </SubContentWrapper>
        </div>
    );
});

export default ProfileDescription;