import styles from './main.module.css';
import globalStyles from '../../global.module.css';

const DirectInformationType = ({chat}) => {
    return (
        <div className={globalStyles.wrapper}>
            <div className={globalStyles.heaader}>
                <div className={globalStyles.avatar}>
                    <img
                        src={chat.avatarPath}
                        draggable="false" 
                    />
                </div>
                <div className={globalStyles.chatInformation}>
                    <h1>{chat.name}</h1>
                    <h1>{chat}</h1>
                </div>
            </div>
        </div>
    );
};

export default DirectInformationType;