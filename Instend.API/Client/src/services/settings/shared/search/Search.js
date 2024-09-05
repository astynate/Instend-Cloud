import React from 'react';
import SearchImage from './search.png';
import external_styles from '../setting/styles/main.module.css';
import styles from './main.module.css';

const Search = (props) => {

    return (

        <div className={external_styles.setting} id="first">
            <img 
                src={SearchImage} 
                className={styles.settingImage}
            />
            <input 
                placeholder={props.placeholder} 
                className={styles.settingInput} 
                onChange={(event) => props.setValue(event.target.value)}
            />
        </div>
        
    );

};

export default Search;