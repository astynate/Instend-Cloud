import styles from './main.module.css';

const SavedState = ({state, text = ''}) => {
    return (
        <div className={styles.unsaved}>
            <span className={styles.title} id={state ? "saved" : null}>{state ? 'Changes saved' : 'Changes not saved'}</span>
            <span className={styles.paragraph}>{text}</span>
        </div>
    );
};

export default SavedState;