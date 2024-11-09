import React, { useState } from 'react';
import styles from './styles/main.module.css';
import search from './images/search.png';
import { useTranslation } from 'react-i18next';
import exploreState from '../../../../../states/explore-state';

const Search = () => {
    const [isAvailable, setAvailable] = useState(true);
    const { t } = useTranslation();
    let timerId = null;

    const GetData = async (prefix) => {
        if (timerId) {
            clearTimeout(timerId);
        }

        if (prefix && prefix !== '' && isAvailable === true) {
            timerId = setTimeout(async () => {
                setAvailable(false);
                await exploreState.GetUsers(prefix);
                await exploreState.GetFiles(prefix);
                setAvailable(true);
            }, 700);
        }
    }

    return (
        <div className={styles.search}>
            <img 
                src={search} 
                draggable={false} 
            />
            <input 
                placeholder={t('global.search_in_instend')} 
                onInput={(event) => GetData(event.target.value)}
            />
        </div>
    );
};

export default Search;