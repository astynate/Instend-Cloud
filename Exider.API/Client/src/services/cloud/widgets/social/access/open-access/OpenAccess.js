import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from '../../../../shared/pop-up-window/elements/search/Search';
import Friends from '../../../../shared/pop-up-window/elements/friends/Friends';
import { useContext, useState } from 'react';
import { OpenAccessContext } from '../../../../process/open-access/OpenAccessProcess';

const OpenAccess = (props) => {
    const [isLoading, setLoadingState] = useState(false);
    const context = useContext(OpenAccessContext);

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
                        setSearchResult={context.setSearchUsers}
                        setLoadingState={setLoadingState}
                        setSearchingState={context.setSearchingState}
                        GetData={context.GetData}
                    />
                    <Friends 
                        isLoading={isLoading} 
                    />
                </div>
        </PopUpWindow>
    );

};

export default OpenAccess;