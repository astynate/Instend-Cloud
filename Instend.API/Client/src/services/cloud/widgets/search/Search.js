import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/main.module.css';
import search from './images/search.png';
import SearchHandler from '../../../../handlers/SearchHandler';

const Search = ({title}) => {
    const [isAvailable, setAvailable] = useState(true);
    const [timerId, setTimerId] = useState(null);
    const { t } = useTranslation();

    return (
        <div className={styles.searchWrapper}>
            {title && <div className={styles.title}>
                <h1>{title}</h1>
            </div>}
            <div className={styles.search}>
                <img 
                    src={search} 
                    draggable={false} 
                />
                <input 
                    placeholder={t('global.search_in_instend')} 
                    onInput={(event) => SearchHandler.SearchAll(event.target.value, isAvailable, setAvailable, timerId, setTimerId)}
                />
            </div>
        </div>
    );
};

export default Search;