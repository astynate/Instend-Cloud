import { useState } from 'react';
import SelectElementWithCheckmark from '../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';
import styles from './main.module.css';
import StorageController from '../../../../../../api/StorageController';
import Base64Handler from '../../../../../../utils/handlers/Base64Handler';

const AttachmentImage = ({image, isEditable = false, setAttachments}) => {
    const [_, setSelectedState] = useState(true);

    return (
        <div className={styles.imageWrapper}>
            <img 
                src={image.preview ? Base64Handler.Base64ToUrlFormatPng(image.preview) : StorageController.getFullFileURL(image.path)} 
                draggable={false}
            />
            {isEditable && <SelectElementWithCheckmark
                isSelected={true} 
                setSelectedState={setSelectedState}
                isSelectedOpen={isEditable}
                setSelectedFiles={setAttachments}
                element={image}
                top={7}
                right={7}
            />}
        </div>
    );
};

export default AttachmentImage;