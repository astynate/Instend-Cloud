import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';
import ScrollElementWithDotsAndFetch from '../../../elements/scroll/scroll-element-with-dots-and-fetch/ScrollElementWithDotsAndFetch';
import NewsState from '../../../../../state/entities/NewsState';

const PublicationList = ({publications = [], fetchRequest, isHasMore}) => {
    return (
        <PublicationsWrapper key={publications.length}>
            <div className={styles.publications}>
                {publications
                    .sort((a, b) => NewsState.sortByDate(a, b))
                    .map((publication, index) => {
                        return (
                            <Publication
                                key={index}
                                publicationObject={publication}
                            />
                        );
                    })}
            </div>
            {isHasMore &&
                <ScrollElementWithDotsAndFetch 
                    fetchRequest={fetchRequest}
                    isHasMore={isHasMore}
                />}
        </PublicationsWrapper>
    );
};

export default PublicationList;