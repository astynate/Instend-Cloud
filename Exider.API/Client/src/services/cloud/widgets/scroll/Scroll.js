import React, { useEffect, useRef } from 'react';

const Scroll = (props) => {
    const ref = useRef();
    const hasMoreRef = useRef(props.hasMore);

    useEffect(() => {
        props.callback();
    }, []);

    const checkScroll = async () => {
      if (ref.current && hasMoreRef.current === true) {
        const rect = ref.current.getBoundingClientRect();

        if (rect.top < window.innerHeight) {
            await props.callback();
        }
      }
    };
  
    useEffect(() => {
        checkScroll();
    }, [props.count]);

    useEffect(() => {
        if (props.scroll && props.scroll.current) {
            props.scroll.current.addEventListener('scroll', () => checkScroll());
      
            return () => {
                try {
                    props.scroll.current.removeEventListener('scroll', () =>  checkScroll());
                } catch {}
            };
        }
    }, []);
  
    return <div ref={ref}></div>;
 };

export default Scroll;
