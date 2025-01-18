import styles from './main.module.css';

const Select = ({options = [], value, setValue}) => {
    const handleChange = (event) => {
        setValue(parseInt(event.target.value));
    };

    return (
        <select className={styles.select} value={value} onChange={handleChange}>
            {options.map((option, index) => {
                return (
                    <option 
                        key={index} 
                        value={option.value}
                    >
                        {option.label}
                    </option>
                )
            })}
        </select>
    );
};

export default Select;