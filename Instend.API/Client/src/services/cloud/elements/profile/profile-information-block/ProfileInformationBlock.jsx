import styles from './main.module.css';
import PublicationsWrapper from '../../../features/wrappers/publications-wrapper/PublicationsWrapper';

const ProfileInformationBlock = ({title, text, content, button}) => {
    return (
        <PublicationsWrapper isHasBorder={true} borderRadius={30}>
            <div className={styles.textBlock}>
                <div className={styles.block}>
                    <div className={styles.titleWrapper}>
                        <h1>{title}</h1>
                        {button && <h2 onClick={button.callback}>{button.label}</h2>}
                    </div>
                    <span className={styles.text}>{text}</span>
                </div>
                {content}
            </div>
        </PublicationsWrapper>
    );
}

export default ProfileInformationBlock;