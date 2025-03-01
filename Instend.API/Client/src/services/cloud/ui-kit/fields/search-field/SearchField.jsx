import styles from './main.module.css';
import search from './images/search.png';
import SearchHandler from '../../../../../handlers/SearchHandler';
import { useState } from 'react';

const SearchField = ({placeholder = "Search", callback = () => {}}) => {
    const [isAvailable, setAvailable] = useState(true);
    const [timerId, setTimerId] = useState(null);

    return (
        <div className={styles.search}>
            <img src={search} draggable="false" className={styles.image} />
            <input 
                className={styles.searchField}
                placeholder={placeholder}
                onInput={(event) => SearchHandler.SearchAll(event.target.value, isAvailable, setAvailable, timerId, setTimerId)}
            />
        </div>
    );
};

export default SearchField;