import { Link, useParams } from 'react-router-dom';
import { ConvertDateToTime } from '../../../../../../../../utils/handlers/DateHandler';
import styles from './main.module.css';

const ChatPreview = ({avatar, name, chat}) => {
    let params = useParams();

    if (!chat) {
        return null;
    }

    const GetMessage = () => {
        if (chat && chat.messages && chat.messages.length) {
            const index = Math.max(chat.messages.length - 1, 0);
            const message = chat.messages[index];

            return message;
        }

        return {};
    };

    return (
        <Link to={`/messages/${chat.id}`} className={styles.chatPreview} id={params.id === chat.id ? 'selected' : null}>
            <img 
                src={avatar}
                draggable="false"
                className={styles.avatar} 
            />
            <div className={styles.data}>
                <span className={styles.name}>{name}</span>
                <span className={styles.message}>{GetMessage().text}</span>
            </div>
            <span className={styles.time}>{ConvertDateToTime(GetMessage().date)}</span>
        </Link>
    );
};

export default ChatPreview;