import styles from './main.module.css';

const ChatAvatar = ({text}) => {
    const GetShortName = (value) => {
        if (!value || !value.length) { return "-" };

        const splitingValue = value.split(' ');
        return splitingValue.length > 1 ? `${splitingValue[0][0]}${splitingValue[1][0]}` : value[0];
    }

    return (
        <div className={styles.avatarPlaceholder}>
            <span>{GetShortName(text)}</span>
        </div>
    );
}

export default ChatAvatar;