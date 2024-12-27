import styles from './main.module.css';

const Input = ({isMultiline, title, value, defaultValue, setValue, maxLength}) => {
    if (isMultiline) {
        return <textarea 
            placeholder={title}
            defaultValue={defaultValue}
            value={value}
            className={styles.input} 
            onChange={(event) => setValue(event.target.value)}
            maxLength={maxLength}
        />
    }
    
    return (
        <input 
            placeholder={title}
            defaultValue={defaultValue}
            value={value}
            className={styles.input} 
            onChange={(event) => setValue(event.target.value)}
            maxLength={maxLength}
        />
    );
};

export default Input;