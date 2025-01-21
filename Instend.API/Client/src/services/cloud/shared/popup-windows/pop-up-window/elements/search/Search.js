import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import search from '../../images/search.png';

const Search = ({setSearchResult, setLoadingState, fetchData}) => {
    const [prefix, setPrefix] = useState('');
    const [prevTimer, setPrevTimer] = useState();

    useEffect(() => {
        if (!!prefix === false) {
            setSearchResult([]);
            setLoadingState(false);

            return;
        }

        if (prevTimer) {
            clearTimeout(prevTimer);
        }

        const timer = setTimeout(
            () => fetchData(prefix), 
            350
        );

        setPrevTimer(timer);
    }, [prefix]);

    return (
        <div className={styles.search}>
            <img 
                src={search} 
                draggable={false} 
            />
            <input 
                placeholder='Search' 
                value={prefix} 
                onChange={(event) => setPrefix(event.target.value)} 
            />
        </div>
    );
};

export default Search;
