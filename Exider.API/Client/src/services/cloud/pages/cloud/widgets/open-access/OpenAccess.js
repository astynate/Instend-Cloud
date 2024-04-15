import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from '../../../../shared/pop-up-window/elements/search/Search';
import Friends from '../../../../shared/pop-up-window/elements/friends/Friends';

const OpenAccess = (props) => {

    return (
        <PopUpWindow 
            open={props.open} 
            close={props.close}
            back={props.back}
            title={"Manage access"}
        >
                <div className={styles.openAccessWrapper}>
                    <Search />
                    <Friends />
                </div>
        </PopUpWindow>
    );

};

export default OpenAccess;