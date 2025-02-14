import styles from './main.module.css';
import checkmark from './checkmark.png';

const SelectElementWithCheckmark = ({
        top = -5,
        right = -10,
        item = {},
        items = [],
        children,
        isSelectedOpen = false,
        maxLength = 5,
        setItems = () => {},
    }) => {

    return (
        <div className={styles.wrapper}>
            {children}
            {isSelectedOpen && <div 
                className={styles.select}
                style={{top: `${top}px`, right: `${right}px`}}
                onClick={(event) => {
                    setItems(prev => {
                        if (items.find(e => e.id === item.id)) {
                            return prev.filter(e => e.id !== item.id);
                        } else if (prev.length < maxLength) {
                            return [item, ...prev];
                        };

                        return prev;
                    });

                    event.preventDefault();
                }}
            >
                {!!items.find(e => e.id === item.id) && <div className={styles.checkMark}>
                    <img src={checkmark} draggable="false" />
                </div>}
            </div>}
        </div>
    );
};

export default SelectElementWithCheckmark;