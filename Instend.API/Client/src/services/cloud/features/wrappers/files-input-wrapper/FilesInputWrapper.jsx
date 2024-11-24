import styles from './main.module.css';

const FilesInputWrapper = ({ children, setFiles = () => {}, maxLength = 1 }) => {
    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleChange = (event) => {
        const files = event.target.files;
        const result = Array.from(files).slice(0, maxLength);
        
        const base64Promises = result.map(file => convertToBase64(file));
        
        Promise.all(base64Promises).then(base64Strings => {
            setFiles(base64Strings);
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                resolve(reader.result);
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            {children}
            <input 
                id='fileInput'
                type='file' 
                className={styles.input} 
                onChange={handleChange}
                multiple={true}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default FilesInputWrapper;