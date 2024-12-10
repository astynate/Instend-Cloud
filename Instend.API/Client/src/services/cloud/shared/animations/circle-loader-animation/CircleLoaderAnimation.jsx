import styles from './main.module.css';

const CircleLoaderAnimation = ({color = "var(--main-button-font-color)", accent = "var(--main-button-background-color"}) => {
    return (
        <div className={styles.loader} style={{'--color': color, '--accent': accent}}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default CircleLoaderAnimation;