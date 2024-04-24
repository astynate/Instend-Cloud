import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const Sroll = (props) => {
    const [available, setAvailableState] = useState(true);
    const ref = useRef();

    useEffect(() => {
        let length = 0;

        for (let i = 0; i < props.array.length - 1; i++) {
            length += props.array[i][0].length;
        }
    }, [props.length]);

    const checkScroll = async () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();

        if (available && props.isHasMore && rect.top < window.innerHeight) {
            setAvailableState(false);
            await props.callback(props.photos);
            setAvailableState(true);
        }
      }
    };
  
    useEffect(() => {
        checkScroll();
    }, [props.length]);

    useEffect(() => {
        props.scroll.current.addEventListener('scroll', checkScroll);
      
        return () => {
            try {
                props.scroll.current.removeEventListener('scroll', checkScroll);
            } catch {}
        };
    }, []);
  
    return <div ref={ref}>Привет, я компонент!</div>;
 };

export default Sroll;