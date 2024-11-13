import GlobalContext from "../../../../../global/GlobalContext";
import PopUpWithBackButton from "../features/popu-up-with-back-button/PopUpWithBackButton";
import styles from '../styles/main.module.css';
import check from './images/check.png';
import ApplicationState from '../../../../../state/application/ApplicationState';
import { observer } from 'mobx-react-lite';

const LanguagesPopUp = observer(({close = () => {}}) => {
    return (
        <PopUpWithBackButton title="Languages" close={close}>
            {GlobalContext.supportedLanguages.map((language, index) => {
                return (
                    <div 
                        className={styles.button}
                        key={index}
                        onClick={() => ApplicationState.ChangeLanguage(language.key)}
                    >
                        {ApplicationState.language === language.key ? 
                            <img src={check} className={styles.buttonImage} />
                        :
                            <div className={styles.imagePlaceholder}></div>}
                        <span>{language.label}</span>
                    </div>
                );
            })}
        </PopUpWithBackButton>
    );
});

export default LanguagesPopUp;