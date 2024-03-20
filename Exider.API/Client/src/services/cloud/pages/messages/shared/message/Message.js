import styles from './main.module.css';

const Message = (props) => {

    return(

        <div className={styles.message}>
            <div className={props.isMyMessage && props.avatar == null ? styles.avatarPlaceholder : null} >
                <img 
                    src={props.avatar} 
                    className={props.isMyMessage ? 
                        styles.myAvatar : styles.avatar}
                    draggable='false'
                />
            </div>
            <div>
                <h1 className={styles.name}>{props.name}</h1>
                <p className={styles.text}>{props.text}</p>
            </div>
        </div>

    );

};

export default Message;