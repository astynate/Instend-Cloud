import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from '../../../../shared/pop-up-window/elements/search/Search';
import Friends from '../../../../shared/pop-up-window/elements/friends/Friends';
import { useState } from 'react';

const OpenAccess = (props) => {
    const [isLoading, setLoadingState] = useState(false);

    return (
        <PopUpWindow 
            open={props.open} 
            close={props.close}
            back={props.back}
            title={"Manage access"}
        >
                <div className={styles.openAccessWrapper}>
                    <Search 
                        isLoading={isLoading}
                        setLoadingState={setLoadingState}
                    />
                    <Friends 
                        isLoading={isLoading} 
                    />
                </div>
        </PopUpWindow>
    );

};

export default OpenAccess;