import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';
import ScrollElementWithDotsAndFetch from '../../../elements/scroll/scroll-element-with-dots-and-fetch/ScrollElementWithDotsAndFetch';

const PublicationList = ({publications = [], fetchRequest, isHasMore}) => {
    return (
        <PublicationsWrapper>
            <div className={styles.publications}>
                {publications.map((publication, index) => {
                    return (
                        <Publication
                            publication={publication}
                            key={index}
                        />
                    );
                })}
            </div>
            <ScrollElementWithDotsAndFetch 
                fetchRequest={fetchRequest}
                isHasMore={isHasMore}
            />
        </PublicationsWrapper>
    );
};

export default PublicationList;