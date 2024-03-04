import React from 'react';
import styles from './styles/main.module.css';
import search from './images/search.png';
import { useTranslation } from 'react-i18next';

const Search = () => {

    const { t } = useTranslation();

    return (

        <div className={styles.search}>
            <img src={search} draggable={false} />
            <input placeholder={t('global.search_in_exider')} />
        </div>

    );

};

export default Search;