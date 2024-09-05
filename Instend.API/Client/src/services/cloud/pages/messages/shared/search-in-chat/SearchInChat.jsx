import styles from './main.module.css';
import search from './images/search.png';

const SearchInChat = () => {
    return (
        <div className={styles.search}>
            <img src={search} draggable="false" className={styles.image} />
            <input 
                className={styles.searchField}
                placeholder='Search'
            />
        </div>
    );
}

export default SearchInChat;