import React from 'react';
import styles from './main.module.css';
import PopUpWindow from '../pop-up-window/PopUpWindow';
import MainButton from '../../../ui-kit/buttons/main-button/MainButton';

const PopUpField = ({open, field, callback, close, title, text, placeholder}) => {
    const sendRequest = async () => {
        if (field[0] === '' || field[0] === null) {
          alert('This field must not be empty');
          return;
        }

        await callback();
        field[1]('');
        close();
    }

    const handleEnterPress = async (event) => {
        if (event.key !== 'Enter') {
          return;
        }

        sendRequest();
    }

    return (
        <PopUpWindow
          open={open} 
          close={close}
          isHeaderless={false}
          isHeaderPositionAbsolute={true}
        >
            <div className={styles.field}>
              <h1>{title}</h1>
              <span>{text}</span>
              <input 
                defaultValue={field[0]}
                onInput={(event) => field[1](event.target.value)}
                onKeyDown={handleEnterPress}
                placeholder={placeholder}
                maxLength={50} 
                minLength={1}
                autoFocus={true}
              />
              <MainButton
                value={'Next'}
                callback={sendRequest}
              />
            </div>
        </PopUpWindow>
    );
};

export default PopUpField;