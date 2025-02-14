import { ConvertFullDate } from '../../../../../../../../utils/handlers/DateHandler';
import SelectElementWithCheckmark from '../../../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import styles from './main.module.css';

const CollectionsAttachments = ({
        collections = [], 
        setCollections = () => {}
    }) => {

    return (
        <>
            {collections.map(collection => {
                return (
                    <SelectElementWithCheckmark 
                        key={collection.id}
                        setItems={setCollections}
                        items={collections}
                        item={collection}
                        isSelectedOpen={true}
                    >
                        <div className={styles.collection} key={collection.id}>
                            <div className={styles.files}>
                                {Array.from({length: 4}).map((_, index) => {
                                    return (
                                        <div key={index} className={styles.file}>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.information}>
                                <span className={styles.name}>{collection.name}</span>
                                <span className={styles.date}>{ConvertFullDate(collection.creationTime)}</span>
                            </div>
                        </div>
                    </SelectElementWithCheckmark>
                )
            })}
        </>
    );
};

export default CollectionsAttachments;