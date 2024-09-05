import Base64Handler from '../../../../../utils/handlers/Base64Handler';
import styles from './main.module.css';
import { observer } from "mobx-react-lite";

export const PreviewVideo = observer(({
        file, 
        endpoint, 
        domain, 
        additionalParams={}, 
        preview="",
        autoplay = false,
        muted = true,
        loop = true
    }) => {
    return (
        <video 
            className={styles.video}
            poster={preview}
            controls 
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
        >
            <source src={`${domain}${endpoint}?id=${file.id}&token=${
                localStorage.getItem('system_access_token')}&${Base64Handler.convertObjectToString(additionalParams)}`} />
        </video>
    );
})