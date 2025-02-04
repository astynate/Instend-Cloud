import ChatAvatar from '../../../../elements/chat-avatar/ChatAvatar';
import styles from './main.module.css';
import info from './images/info.png';

const ChatHeader = ({
        avatar, 
        title, 
        subTitle,
        setRightPanelOpenState = () => {},
    }) => {

    return (
        <>
            <div className={styles.header}>
            <div className={styles.left}>
                    <div className={styles.avatar}>
                        {avatar ? 
                            <img 
                                src={avatar}
                                className={styles.avatarImage} 
                                draggable="false"
                            />
                        :
                            <ChatAvatar text={title} />}
                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>{title}</span>
                        <span className={styles.data}>{subTitle}</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <img src={info} 
                        className={styles.buttonImage} 
                        draggable="false"
                        onClick={() => setRightPanelOpenState(p => !p)}
                    />
                </div>
            </div>
        </>
    );
}

export default ChatHeader;