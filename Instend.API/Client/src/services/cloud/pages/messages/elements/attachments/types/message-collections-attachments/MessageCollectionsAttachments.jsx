import { useEffect, useState } from 'react';
import MessageAttachmentsWrapper from '../../../../../../features/wrappers/message-attachments-wrapper/MessageAttachmentsWrapper';
import styles from './main.module.css';
import FilesController from '../../../../../../api/FilesController';

const MessageCollectionsAttachments = ({ collections = [] }) => {
    const [currectCollections, setCurrentCollections] = useState(collections);
    
    const updateCollectionsFiles = async () => {
        for (let collection of currectCollections) {
            await FilesController.GetFilesByParentCollectionId(
                collection.id,
                0,
                6,
                (files) => {
                    setCurrentCollections(prev => {
                        return prev.map(item => {
                            if (item.id === collection.id) {
                                item.files = files;
                            };

                            return item;
                        })
                    })
                }
            );
        }
    };

    useEffect(() => {
        setCurrentCollections(collections);
        updateCollectionsFiles();
    }, [collections]);

    return (
        <MessageAttachmentsWrapper>
            <div className={styles.collections}>
                {currectCollections.map(collection => {
                    return (
                        <div key={collection.id} className={styles.collection}>
                            <div className={styles.header}>
                                <span className={styles.name}>{collection.name}</span>
                                <span className={styles.time}>{collection.creationTime}</span>
                            </div>
                            <div className={styles.files}>
                                {collection.files.map(file => {
                                    return (
                                        <div 
                                            className={styles.file}
                                            key={file.id}
                                        >
                                            <span>{file.type}</span>
                                        </div>
                                    )
                                })}
                                {Array.from({length: 6 - collection.files.length}).map((_, index) => {
                                    return (
                                        <div className={styles.file} key={index}></div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </MessageAttachmentsWrapper>
    );
};

export default MessageCollectionsAttachments;