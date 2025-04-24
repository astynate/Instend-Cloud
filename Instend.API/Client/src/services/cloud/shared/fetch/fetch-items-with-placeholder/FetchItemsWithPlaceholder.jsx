import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const FetchItemsWithPlaceholder = ({ item = <div></div>, isHasMore = true, callback = () => {} }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [placeholders, setPlaceholders] = useState([]);
    const containerRef = useRef(null);

    const fetchItems = async () => {
        if (isHasMore && !isFetching) {
            setIsFetching(true);
            setPlaceholders(Array.from({ length: 5 }).map(_ => item));
            await callback();
            setPlaceholders([]);
            setIsFetching(false);
        };
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchItems();
                };
            },
            { 
                threshold: 1.0 
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        };

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            };
        };
    }, [isHasMore, isFetching, placeholders]);

    return (
        <>
            {placeholders.map((placeholder, index) => (
                <div key={index}>
                    {(placeholder)}
                </div>
            ))}
            <div className={styles.fetchitem} ref={containerRef}></div>
        </>
    );
};

export default FetchItemsWithPlaceholder;