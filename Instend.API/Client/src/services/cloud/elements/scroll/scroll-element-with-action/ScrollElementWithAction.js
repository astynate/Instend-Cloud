import React, { useEffect, useRef } from 'react';

const ScrollElementWithAction = ({scrollElement, counter, isHasMore, callback = () => {}}) => {
    const ref = useRef();
    const hasMoreRef = useRef(isHasMore);

    useEffect(() => {
        if (isHasMore) {
            callback();
        };
    }, []);

    const checkScroll = async () => {
      if (ref.current && hasMoreRef.current === true) {
        const rect = ref.current.getBoundingClientRect();

        if (rect.top < window.innerHeight) {
            await callback();
        };
      };
    };
  
    useEffect(() => {
        checkScroll();
    }, [counter]);

    useEffect(() => {
        if (scrollElement && scrollElement.current) {
            scrollElement.current.addEventListener('scroll', () => checkScroll());
      
            return () => {
                try {
                    scrollElement.current.removeEventListener('scroll', () =>  checkScroll());
                } catch (error) {
                    console.error(error);
                };
            };
        }
    }, []);
  
    return <div ref={ref}></div>;
};

export default ScrollElementWithAction;
