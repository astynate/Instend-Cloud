import { ConvertFullDate } from '../../../../../../../../utils/handlers/DateHandler';
import SelectElementWithCheckmark from '../../../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import styles from './main.module.css';

const FilesAttachments = ({
        files = [], 
        setSelectedFiles = () => {}
    }) => {

    return (
        <>
            {files.map(file => {
                return (
                    <SelectElementWithCheckmark 
                        key={file.id}
                        setItems={setSelectedFiles}
                        items={files}
                        item={file}
                        isSelectedOpen={true}
                    >
                        <div className={styles.fileWrapper} key={file.id}>
                            <div className={styles.file}>
                                
                            </div>
                            <div className={styles.information}>
                                <span className={styles.name}>{file.name}</span>
                                <span className={styles.date}>{ConvertFullDate(file.creationTime)}</span>
                            </div>
                        </div>
                    </SelectElementWithCheckmark>
                )
            })}
        </>
    );
};

export default FilesAttachments;