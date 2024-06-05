import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Description from '../../../../widgets/description/Description';
import { useNavigate } from 'react-router-dom';
import userState from '../../../../../../states/user-state';

const ProfileDescription = observer(({isMobile}) => {
    const { t } = useTranslation();
    const { user } = userState;
    const navigate = useNavigate();

    if (user) {
        return (
            <Description 
                isMobile={isMobile}
                avatar={user.avatar}
                title={user.nickname}
                subtitle={`${user.name} ${user.surname}`}
                stats={[
                    {title: t('cloud.profile.coins'), amount: user.balance},
                    {title: t('cloud.profile.friends'), amount: user.friendCount},
                    {title: 'MB', amount: (user.storageSpace / (1024 * 1024)).toFixed(0)}
                ]}
                buttons={[
                    {
                        title: t('cloud.profile.edit_profile'), 
                        callback: () => navigate('/settings/profile')
                    }
                ]}
            />
        );
    } else {
        return null;
    }
});

export default ProfileDescription;