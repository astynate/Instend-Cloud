import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExploreState from '../../../../state/entities/ExploreState';
import styles from './styles/main.module.css';
import search from './images/search.png';
import SubContentWrapper from '../../features/wrappers/sub-content-wrapper/SubContentWrapper';
import AccountController from '../../../../api/AccountController';

const Search = ({isMovable = false}) => {
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
                await AccountController.GetAccountsByPrefix(prefix, ExploreState.setAccounts);
                setAvailable(true);
            }, 700);
        }
    }

    return (
        <SubContentWrapper>
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
        </SubContentWrapper>
    );
};

export default Search;