import React from 'react';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import { observer } from 'mobx-react-lite';
import userState from '../../../../states/user-state';
import Setting from '../../shared/setting/Setting';

const Profile = observer(() => {

    const { user } = userState;

    return (

        <>
            <SettingType 
                image={<img src={`data:image/png;base64,${user.avatar}`} className={styles.avatar} />} 
                title="Avatar" 
                description="Please note that your profile photo will be visible to everyone." 
            />
            <div className={styles.settingBar}>
                <Setting type="first" />
                <Setting />
                <Setting />
                <Setting type="last" />
            </div>
            <SettingType 
                image={
                    <div className={styles.headerWrapper}>
                        {user.header ? <img 
                            src={`data:image/png;base64,${user.header}`} 
                            className={styles.header} 
                            /> : null}
                    </div>} 
                title="Header" 
                description="Please note that your profile photo will be visible to everyone." 
            />
            <div className={styles.settingBar}>
                <Setting type="first" />
                <Setting />
                <Setting />
                <Setting type="last" />
            </div>
        </>
        
    );

});

export default Profile;