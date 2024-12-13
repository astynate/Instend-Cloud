import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';
import ScrollElementWithDotsAndFetch from '../../../elements/scroll/scroll-element-with-dots-and-fetch/ScrollElementWithDotsAndFetch';
import NewsState from '../../../../../state/entities/NewsState';

const PublicationList = ({publications = [], fetchRequest, isHasMore}) => {
    return (
        <PublicationsWrapper>
            <div className={styles.publications}>
                {publications
                    .sort((a, b) => NewsState.sortByDate(a, b))
                    .map((publication, index) => {
                        return (
                            <Publication
                                key={index}
                                publication={publication}
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