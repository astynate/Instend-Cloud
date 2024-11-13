import { observer } from "mobx-react-lite";
import ApplicationState from "../../../../../state/application/ApplicationState";
import Switch from "../../../ui-kit/basic/switch/Switch";
import PopUpWithBackButton from "../features/popu-up-with-back-button/PopUpWithBackButton";
import styles from '../styles/main.module.css';

const ThemePopUp = observer(({close}) => {
    const SwitchColorTheme = () => {
        const theme = ApplicationState.theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        ApplicationState.ChangeTheme(theme);
    }

    return (
        <PopUpWithBackButton title={"Theme"} close={close}>
            <div className={styles.button} onClick={SwitchColorTheme}>
                <span>Dark mode</span>
                <Switch isActive={ApplicationState.theme === 'dark-mode'} />
            </div>
        </PopUpWithBackButton>
    );
});

export default ThemePopUp;