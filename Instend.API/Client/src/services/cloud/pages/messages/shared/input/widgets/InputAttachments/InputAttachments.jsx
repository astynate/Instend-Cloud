import CollectionsAttachments from '../../features/collections-attachments/CollectionsAttachments';
import DeviceAttachments from '../../features/device-attachments/DeviceAttachments';
import EditAttachments from '../../features/edit-attachments/EditAttachments';
import FilesAttachments from '../../features/files-attachments/FilesAttachments';
import styles from './main.module.css';

const InputAttachments = ({
        collections = [],
        files = [],
        attachements = [],
        setAttachemnts = () => {},
        setInstendCloudState = () => {},
        setSelectedFiles = () => {},
        setCollections = () => {},
    }) => {

    const GetHandler = () => {
        if (collections.length > 0) {
            return <CollectionsAttachments 
                collections={collections} 
                setCollections={setCollections}
            />;
        };

        if (files.length > 0) {
            return <FilesAttachments 
                files={files}
                setSelectedFiles={setSelectedFiles}
            />;
        };

        if (attachements.length > 0) {
            return <DeviceAttachments 
                attachments={attachements}
                setAttachments={setAttachemnts}
            />;
        };

        return null;
    };

    let Handler = GetHandler();

    return (
        <div className={styles.inputAttachments}>
            <EditAttachments 
                callback={setInstendCloudState}
            />
            {Handler && (Handler)}
        </div>
    );
};

export default InputAttachments;