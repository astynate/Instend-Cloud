import React from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Search from '../../../../shared/pop-up-window/elements/search/Search';
import Friends from '../../../../shared/pop-up-window/elements/friends/Friends';
import Select from '../../../../shared/pop-up-window/elements/select/Select';

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
        </PopUpWindow>
    );

};

export default OpenAccess;