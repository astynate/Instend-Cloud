import React from 'react';
import styles from './main.module.css';
import addPeople from './add-people.png';

const AddUser = ({callback}) => {
    return (
        <div className={styles.userAvatar} onClick={callback}>
            <img 
                src={addPeople} 
                draggable={false}
            />
        </div>
    );
};

export default AddUser;