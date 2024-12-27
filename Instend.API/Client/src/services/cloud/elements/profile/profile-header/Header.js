import React from 'react';
import styles from './styles/main.module.css';
import Base64Handler from '../../../../../utils/handlers/Base64Handler';

const Header = ({src}) => {
    return (
        <div className={styles.header}>
            {!!src === true && <img 
              src={Base64Handler.Base64ToUrlFormatPng(src)} 
              draggable={false}
            />}
        </div>
    );
};

export default Header;