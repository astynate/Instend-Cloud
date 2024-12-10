import CircleLoaderAnimation from '../../shared/animations/circle-loader-animation/CircleLoaderAnimation';
import styles from './main.module.css';

const ButtonContent = ({label, state = 'default'}) => {
    if (state === 'loading') {
        return <CircleLoaderAnimation />
    }
    
    return <span className={styles.label}>{label}</span>
};

export default ButtonContent;