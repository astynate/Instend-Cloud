import styles from './main.module.css';
import image from './image.png';

const AvatarPicker = ({avatar, setAvatar}) => {
    return (
        <div className={styles.avatarPicker}>
            <div className={styles.image}>
                <img 
                    src={image} 
                    draggable="false"
                />
            </div>
            {avatar && <img 
                src={URL.createObjectURL(avatar)} 
                draggable="false"
                className={styles.mainImage}
            />}
            <input type='file' onInput={(event) => {
                setAvatar(event.target.files[0]);
            }} accept='image/*' />
        </div>
    );
};

export default AvatarPicker;