import React from 'react';
import styles from './main.module.css';
import CommunityPreview from '../../widgets/community-preview/CommunityPreview';

const Communities = () => {
  return (
    <>
        {Array.from({length: 0}).map((_, index) => {
            return (
                <CommunityPreview 
                    key={index}
                />
            );
        })}
    </>
  )
}

export default Communities;