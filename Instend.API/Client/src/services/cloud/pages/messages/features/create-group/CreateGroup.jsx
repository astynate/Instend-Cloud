import { useEffect, useState } from "react";
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import Input from "../../../../shared/ui-kit/input/Input";
import styles from './main.module.css';
import Button from "../../../../shared/ui-kit/button/Button";
import AvatarPicker from "../../../../shared/pop-up-window/elements/avatar-picker/AvatarPicker";
import applicationState from "../../../../../../states/application-state";
import { instance } from "../../../../../../state/Interceptors";
import { globalWSContext } from "../../../../layout/Layout";
import chatsState from "../../../../../../states/ChatsState";
import { useNavigate } from "react-router-dom";

const CreateGroup = ({open, close}) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setName('');
        setAvatar(null);
    }, [open])

    const CreateGroup = async () => {
        const connectionId = globalWSContext?.connection?.connectionId;

        if (!connectionId) {
            applicationState.AddErrorInQueue('Attantion!', 'Check your connection.');
            return;
        }
        
        if (name === '' || name === null || name === undefined) {
            applicationState.AddErrorInQueue('Attantion!', 'Name fields is required.');
            return;
        }

        if (avatar === null || avatar === undefined) {
            applicationState.AddErrorInQueue('Attantion!', 'Please select a group avatar.');
            return;
        }

        let form = new FormData();

        form.append('name', name);
        form.append('connectionId', connectionId);
        form.append('avatar', avatar);

        await instance.post('/api/groups', form)
            .then(response => {
                var result = response.data;

                if (result) {
                    chatsState.addGroup(result);
                    navigate(`/messages/${result.Id}`);
                }
            })
            .catch(error => {
                applicationState.AddErrorInQueue('Attantion!', 'Something went wrong.');
            });

        close();
    }

    console.log();

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
                    <Button 
                        value={'Next'}
                        callback={() => CreateGroup()}
                    />
                </div>
            </div>
        </PopUpWindow>
    );
}

export default CreateGroup;