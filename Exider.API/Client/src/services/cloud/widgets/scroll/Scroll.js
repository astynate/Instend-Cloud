import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const Scroll = (props) => {
    const [available, setAvailableState] = useState(true);
    const ref = useRef();
    const isHasMoreRef = useRef(props.isHasMore);
    const isAvailable = useRef(available);

    useEffect(() => {
        isHasMoreRef.current = props.isHasMore;
    }, [props.isHasMore]);

    const checkScroll = async () => {
      if (ref.current && isHasMoreRef.current === true) {
        const rect = ref.current.getBoundingClientRect();

        if (isAvailable.current === true && rect.top < window.innerHeight) {
            setAvailableState(false);
            await props.callback();
            setAvailableState(true);
        }
      }
    };
  
    useEffect(() => {
        if (isHasMoreRef && isHasMoreRef.current === true) {
            checkScroll();
        }
    }, [props.array.length]);

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
