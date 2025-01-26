import styles from './main.module.css';

const Input = ({type = 'text', isMultiline, title, value, defaultValue, setValue, maxLength}) => {
    if (isMultiline) {
        return <textarea 
            placeholder={title}
            defaultValue={defaultValue}
            value={value}
            className={styles.input} 
            onChange={(event) => setValue(event.target.value)}
            maxLength={maxLength}
        />
    };
    
    return (
        <input 
            type={type}
            placeholder={title}
            defaultValue={defaultValue}
            value={value}
            className={styles.input} 
            onChange={(event) => setValue(event.target.value)}
            maxLength={maxLength}
            required
        />
    );
};

export default Input;