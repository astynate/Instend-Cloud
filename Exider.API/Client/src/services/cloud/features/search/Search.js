import React from 'react';
import styles from './styles/main.module.css';
import search from './images/search.png';

const Search = () => {

    return (

        <div className={styles.search}>
            <img src={search} draggable={false} />
            <input placeholder='Search in Exider' />
        </div>

    );

};

export default Search;