import SelectElementWithCheckmark from '../../../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import styles from './main.module.css';

const DeviceAttachments = ({
        attachments = [], 
        setAttachments = () => {}
    }) => {

    return (
        <>
            {attachments.map((attachment, index) => {
                const fileName = attachment.name;
                const fileExtension = fileName.split('.').pop();

                return (
                    <SelectElementWithCheckmark 
                        key={index}
                        setItems={setAttachments}
                        items={attachments}
                        item={attachment}
                        isSelectedOpen={true}
                    >
                        <div className={styles.collection} key={attachment.id}>
                            <div className={styles.file}>
                                
                            </div>
                            <div className={styles.information}>
                                <span className={styles.name}>{attachment.name}</span>
                                <span className={styles.date}>{fileExtension}</span>
                            </div>
                        </div>
                    </SelectElementWithCheckmark>
                )
            })}
        </>
    );
};

export default DeviceAttachments;