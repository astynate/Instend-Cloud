import React from 'react';
import styles from './main.module.css';
import PopUpWindow from '../pop-up-window/PopUpWindow';
import Button from '../ui-kit/button/Button';

const PopUpField = (props) => {
  return (
    <PopUpWindow
      open={props.open} 
      close={props.close}
      isHeaderless={false}
      isHeaderPositionAbsulute={true}
    >
      <div className={styles.field}>
        <h1>{props.title}</h1>
        <span>{props.text}</span>
        <input 
          defaultValue={props.field[0]}
          onInput={(event) => props.field[1](event.target.value)}
          placeholder={props.placeholder}
          maxLength={50} 
          minLength={1}
          autoFocus={true}
        />
        <Button 
          value={'Next'}
          onClick={async () => {
            if (props.field[0] === '' || props.field[0] === null){
              alert('This field must not be empthy');
            } else {
              await props.callback();
              props.close();
            }
          }}
        />
      </div>
    </PopUpWindow>
  );
};

export default PopUpField;
