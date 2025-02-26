import { useEffect, useState } from "react";
import styles from './main.module.css';
import PopUpWindow from "../../../../shared/popup-windows/pop-up-window/PopUpWindow";
import AvatarPicker from "../../../../shared/popup-windows/pop-up-window/elements/avatar-picker/AvatarPicker";
import Input from "../../../../ui-kit/fields/input/Input";
import GroupsController from "../../../../api/GroupsController";
import MainButton from "../../../../ui-kit/buttons/main-button/MainButton";

const CreateGroup = ({open, close}) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState();

    useEffect(() => {
        setName('');
        setAvatar(null);
    }, [open]);

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
                        callback={() => GroupsController.CreateGroup(name, avatar, close)}
                    />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default CreateGroup;