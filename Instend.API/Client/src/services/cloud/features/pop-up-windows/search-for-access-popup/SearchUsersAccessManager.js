import { useContext, useState } from 'react';
import { OpenAccessContext } from '../../../process/open-access/OpenAccessProcess';
import styles from './main.module.css';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';
import Search from '../../../shared/popup-windows/pop-up-window/elements/search/Search';

const SearchUsersAccessManager = ({open, close, back}) => {
    const [isLoading, setLoadingState] = useState(false);
    const context = useContext(OpenAccessContext);

    return (
        <PopUpWindow
            open={open}
            close={close}
            back={back}
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
                    {/* <Friends 
                        isLoading={isLoading} 
                    /> */}
                </div>
        </PopUpWindow>
    );

};

export default SearchUsersAccessManager;