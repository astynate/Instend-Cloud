import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';

const PublicationList = ({
        publications = [],
        setLike = () => {}, 
        id, 
        setUploadingComment, 
        deleteCallback, 
        isPublicationAvailable = true, 
        isPublications = false,
        type = 0
    }) => {

    return (
        <PublicationsWrapper>
            <div className={styles.publications}>
                {publications.map((publication, index) => {
                    return (
                        <Publication 
                            key={index}
                        />
                    );
                })}
            </div>
        </PublicationsWrapper>
    );
 };

export default PublicationList;