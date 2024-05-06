import React, { useContext, useEffect, useState } from 'react';
import styles from './main.module.css';
import search from '../../images/search.png';

const Search = (props) => {
    const [prefix, setPrefix] = useState('');
    const [prevTimer, setPrevTimer] = useState();

    useEffect(() => {
        if (prefix != null && prefix != "") {
            if (prevTimer) {
                clearTimeout(prevTimer);
            }

            const timer = setTimeout(() => props
                .GetData(prefix), 350);

            setPrevTimer(timer);
            props.setSearchingState(true);

        } else {
            props.setSearchResult([]);
            props.setSearchingState(false);
            props.setLoadingState(false);
        }
    }, [prefix]);

    return (
        <div className={styles.search}>
            <img src={search} draggable={false} />
            <input 
                placeholder='Search' 
                value={prefix} 
                onChange={(event) => setPrefix(event.target.value)} 
            />
        </div>
    );
};

export default Search;
