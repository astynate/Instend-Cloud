import React, { createContext, useEffect, useState } from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from '../../../../shared/pop-up-window/elements/search/Search';
import Friends from '../../../../shared/pop-up-window/elements/friends/Friends';
import Select from '../../../../shared/pop-up-window/elements/select/Select';

export const OpenAccessContext = createContext();

const OpenAccess = (props) => {
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);

    return (
        <PopUpWindow 
            open={props.open} 
            close={props.close}
            back={props.back}
            title={"Manage access"}
        >
            <OpenAccessContext.Provider value={{users, setUsers, searchUsers, setSearchUsers}}>
                <div className={styles.openAccessWrapper}>
                    <Search />
                    <Friends>
                        <Select
                            items={[
                                "Access closed",
                                "Only for reading",
                                "Reading and editing"
                            ]}
                        />
                    </Friends>
                </div>
            </OpenAccessContext.Provider>
        </PopUpWindow>
    );

};

export default OpenAccess;