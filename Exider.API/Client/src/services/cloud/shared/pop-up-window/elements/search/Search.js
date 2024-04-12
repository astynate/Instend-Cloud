import React from 'react';
import styles from './main.module.css';
import search from '../../images/search.png';

const Search = (props) => {

    return (
        <div className={styles.search}>
            <img src={search} draggable={false} />
            <input placeholder='Search' />
        </div>
    );

};

export default Search;