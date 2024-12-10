import styles from './main.module.css';
import logo from './images/instend-logo.png';
import PointsLoaderAnimation from '../points-loader-animation/PointsLoaderAnimation';

const ApplicationLoaderAnimation = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <img src={logo} draggable="false" />
                {/* <h1>Welcome to Instend</h1>
                <span>The best place for your memories.</span> */}
            </div>
            {/* <div className={styles.footer}>
                <PointsLoaderAnimation color='#3190FF' size={10} />
            </div> */}
        </div>
    );
};

export default ApplicationLoaderAnimation;