import { ConvertDate } from '../../../../../handlers/DateHandler';
import PointsLoaderAnimation from '../../../shared/animations/points-loader-animation/PointsLoaderAnimation';
import styles from './main.module.css';

const StorageItemDescription = ({name, time}) => {
    return (
        <div className={styles.description}>
            <div className={styles.nameWrapper}>
                <span className={styles.name}>{name ?? 'Unknown'}</span>
            </div>
            {time ? 
                <span className={styles.time}>
                    {ConvertDate(time)}
                </span>
            :    
                <div style={{marginTop: '10px'}}>
                    <PointsLoaderAnimation 
                        size='5px' 
                        gap='7px' 
                    />
                </div>}
        </div>
    );
};

export default StorageItemDescription;