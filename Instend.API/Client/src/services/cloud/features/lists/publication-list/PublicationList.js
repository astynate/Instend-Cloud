import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';
import ScrollElementWithDotsAndFetch from '../../../elements/scroll/scroll-element-with-dots-and-fetch/ScrollElementWithDotsAndFetch';
import NewsState from '../../../../../state/entities/NewsState';

const PublicationList = ({publications = [], fetchRequest, isHasMore, isHasBorder = false, borderRadius = 25, isDivided = false}) => {
    const getLastNewsDate = () => {
        if (publications.length === 0) {
            return "";
        };
    
        const lastIndex = publications.length - 1;
        return publications[lastIndex].date;
    };
    
    return (
        <PublicationsWrapper key={publications.length} isHasBorder={isHasBorder} borderRadius={borderRadius}>
            <div className={styles.publications} id={isDivided ? 'divided' : null}>
                {publications
                    .sort((a, b) => NewsState.sortByDate(a, b))
                    .map((publication) => {
                        return (
                            <div 
                                key={publication.id} 
                                className={styles.publication} 
                                id={isDivided ? 'separated' : null}
                            >
                                <Publication publication={publication} />
                            </div>
                        );
                    })}
            </div>
            {isHasMore &&
                <ScrollElementWithDotsAndFetch 
                    fetchRequest={() => fetchRequest(getLastNewsDate())}
                    isHasMore={isHasMore}
                />}
        </PublicationsWrapper>
    );
};

export default PublicationList;