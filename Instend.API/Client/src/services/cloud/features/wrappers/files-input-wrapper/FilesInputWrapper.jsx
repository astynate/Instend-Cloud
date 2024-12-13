import { useState } from 'react';
import GlobalContext from '../../../../../global/GlobalContext';
import styles from './main.module.css';
import PopUpSelectOneOfList from '../../../shared/popup-windows/pop-up-select-one-of-list/PopUpSelectOneOfList';

const FilesInputWrapper = ({children, files = [], setFiles = () => {}, maxLength = 1, supportedTypes = []}) => {
    const [type, setType] = useState(0);
    const [isTypePeakerOpen, setTypePeakerState] = useState(false);

    const handleClick = () => {
        if (files.length > 0 && isTypePeakerOpen === false) {
            setTypePeakerState();
        } else {
            document.getElementById('fileInput').click();
        }
    };

    const createAttachment = async (file) => {
        if (!file.name || file.name.trim() === "") {
            return null;
        }

        if (file.size <= 0) {
            return null;
        }

        const id = GlobalContext.NewGuid();
        const nameParts = file.name.split('.');
        const type = nameParts.length >= 2 ? nameParts[nameParts.length - 1] : "";

        const attachment = {
            id: id,
            name: nameParts[0],
            type: type,
            size: file.size,
            file: file,
            preview: await convertToBase64(file)
        };

        return attachment;
    };

    const GetFileType = (file) => {
        const nameParts = file.name.split('.');
        return nameParts.length >= 2 ? nameParts[nameParts.length - 1] : "";
    }

    const handleChange = (event) => {
        const files = Array.from(event.target.files)
            .filter(file => supportedTypes.includes(GetFileType(file)))
            .slice(0, maxLength);
        
        const attachmentPromises = files
            .map((file) => createAttachment(file));
        
        Promise.all(attachmentPromises).then(attachments => {
            switch(type) {
                case 0: {
                    setFiles(attachments);
                    break;
                }
                case 1: {
                    setFiles(prev => [...prev, ...attachments].slice(0, maxLength));
                    break;
                }
            }

            setType(0);
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <PopUpSelectOneOfList 
                isOpen={isTypePeakerOpen}
                buttons={[
                    {
                        title: "Add", 
                        callback: () => {
                            setType(1);
                            handleClick();
                        }
                    },
                    {
                        title: "Rewrite", 
                        isDangerousOperation: true, 
                        callback: () => {
                            setType(0); 
                            handleClick();
                        }
                    },
                ]}
                setOpenState={setTypePeakerState}
            />
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                {children}
                <input 
                    id='fileInput'
                    type='file' 
                    className={styles.input} 
                    onChange={handleChange}
                    multiple={true}
                    accept=''
                    style={{ display: 'none' }}
                />
            </div>
        </>
    );
};

export default FilesInputWrapper;