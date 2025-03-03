import styles from './main.module.css';
import search from './images/search.png';
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
                onInput={(event) => callback(event.target.value, isAvailable, setAvailable, timerId, setTimerId)}
            />
        </div>
    );
};

export default SearchField;