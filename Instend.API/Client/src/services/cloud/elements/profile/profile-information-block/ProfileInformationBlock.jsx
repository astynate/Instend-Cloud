import styles from './main.module.css';
import PublicationsWrapper from '../../../features/wrappers/publications-wrapper/PublicationsWrapper';

const ProfileInformationBlock = ({title, text}) => {
    return (
        <PublicationsWrapper isHasBorder={true} borderRadius={30}>
            <div className={styles.textBlock}>
                <div className={styles.block}>
                    <h1>{title}</h1>
                    <span>{text}</span>
                </div>
            </div>
        </PublicationsWrapper>
    );
}

export default ProfileInformationBlock;