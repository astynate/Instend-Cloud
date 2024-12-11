import React from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../wrappers/publications-wrapper/PublicationsWrapper';
import Publication from '../../../components/publication/Publication';
import ScrollElementWithDotsAndFetch from '../../../elements/scroll/scroll-element-with-dots-and-fetch/ScrollElementWithDotsAndFetch';
import { observer } from 'mobx-react-lite';

const PublicationList = observer(({publications = [], fetchRequest, isHasMore}) => {
    return (
        <PublicationsWrapper>
            <div className={styles.publications}>
                {publications.map((publication) => {
                    return (
                        <Publication
                            key={publication.id}
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
});

export default PublicationList;