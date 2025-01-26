import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './main.module.css';
import PopUpWindow from "../../../../shared/popup-windows/pop-up-window/PopUpWindow";
import AvatarPicker from "../../../../shared/popup-windows/pop-up-window/elements/avatar-picker/AvatarPicker";
import Input from "../../../../ui-kit/fields/input/Input";
import MainButton from "../../../../ui-kit/buttons/main-button/Button";
import MessangerController from "../../../../api/MessangerController";

const CreateGroup = ({open, close}) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setName('');
        setAvatar(null);
    }, [open])

    return (
        <PopUpWindow
            open={open}
            title={"Create group"}
            close={close}
        >
            <div className={styles.createGroup}>
                <div className={styles.input}>
                    <AvatarPicker
                        avatar={avatar}
                        setAvatar={setAvatar}
                    />
                    <div className={styles.inputField}>
                        <Input
                            value={name}
                            setValue={setName}
                            placeholder={'Name'}
                        />
                        <span className={styles.description}>Maximum 30 symbols</span>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <MainButton
                        value={'Next'}
                        callback={() => MessangerController.CreateGroup()}
                    />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default CreateGroup;