import { useState } from 'react';
import globalStyles from '../../global.module.css';
import StorageController from '../../../../../../../../../../api/StorageController';
import ChatContentLink from '../../../../features/chat-content-link/ChatContentLink';
import account from '../../images/account.png';
import ChatMembers from '../../windows/chat-members/ChatMembers';

const GroupInformationType = ({chat}) => {
    const [CurrectHandler, setCurrentHandler] = useState();

    if (!chat) {
        return null;
    };

    if (CurrectHandler) {
        return (
            <CurrectHandler 
                chat={chat}
                setCurrentHandler={setCurrentHandler}
            />
        );
    };

    return (
        <div className={globalStyles.wrapper}>
            <div className={globalStyles.header}>
                <div className={globalStyles.avatar}>
                    <img
                        src={StorageController.getFullFileURL(chat.avatarPath)}
                        draggable="false" 
                    />
                </div>
                <div className={globalStyles.chatInformation}>
                    <h1 className={globalStyles.chatName}>{chat.name}</h1>
                    <span className={globalStyles.chatSubTitle}>{chat.members.length} members</span>
                </div>
            </div>
            <div className={globalStyles.items}>
                <ChatContentLink 
                    image={account} 
                    title={'Members'}
                    action={() => setCurrentHandler(ChatMembers)}
                />
            </div>
        </div>
    );
};

export default GroupInformationType;