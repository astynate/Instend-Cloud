import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const ScrollElementWithDotsAndFetch = ({fetchRequest = () => {}, isHasMore = false, placeholder = <div></div>}) => {
    const paginationRef = useRef();
    const [isProcessing, setProcessingState] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && fetchRequest && isProcessing === false && isHasMore) {
                    (async function fetch() { 
                        setProcessingState(true);
                        await fetchRequest();
                        setProcessingState(false);
                    })();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (paginationRef.current)
            observer.observe(paginationRef.current);

        return () => {
            if (paginationRef.current)
                observer.unobserve(paginationRef.current);
        };
    }, []);

    return (
        isHasMore ?
            <div ref={paginationRef} className={styles.pagination}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        :
            placeholder
    );
}

export default ScrollElementWithDotsAndFetch;