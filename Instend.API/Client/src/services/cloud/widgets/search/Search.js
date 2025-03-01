import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/main.module.css';
import search from './images/search.png';
import SubContentWrapper from '../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import SearchHandler from '../../../../handlers/SearchHandler';

const Search = ({}) => {
    const [isAvailable, setAvailable] = useState(true);
    const [timerId, setTimerId] = useState(null);
    const { t } = useTranslation();

    return (
        <SubContentWrapper>
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
        </SubContentWrapper>
    );
};

export default Search;