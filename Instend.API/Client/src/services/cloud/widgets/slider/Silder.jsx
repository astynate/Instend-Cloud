import React, { useRef } from 'react';
import styles from './main.module.css';
import ItemsWrapper from '../../features/wrappers/items-wrapper/ItemsWrapper';
import Title from '../../ui-kit/inscriptions/title/Title';

const Slider = ({ title = "People", children }) => {
  const sliderRef = useRef(null);
  const items = React.Children.toArray(children);

  if (items.length === 0) {
    return null;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    };
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    };
  };

  return (
    <div className={styles.slider}>
      <div className={styles.header}>
        {title && <div className={styles.header}><Title text={title} /></div>}
        <div className={styles.controls}>
          <button onClick={scrollLeft} className={styles.button}>◀</button>
          <button onClick={scrollRight} className={styles.button}>▶</button>
        </div>
      </div>
      <div ref={sliderRef} className={styles.scrollArea}>
        <ItemsWrapper isNoWrap={true}>
          {children}
        </ItemsWrapper>
      </div>
    </div>
  );
};

export default Slider;