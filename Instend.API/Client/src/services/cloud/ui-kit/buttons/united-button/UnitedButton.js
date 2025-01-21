import React from "react";
import styles from './main.module.css';
import CircleButtonWrapper from "../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper";

const UnitedButton = ({buttons, isAccent = false}) => {
    return (
      <CircleButtonWrapper heightPaddings={0} widthPaddings={0} isPopUpButton={isAccent}>
        <div className={styles.buttonWrapper}>
          {buttons.map((button, index) => {
  
            return (
              <React.Fragment key={index}>             
                <div 
                  className={styles.button}
                  onMouseOver={button.onMouseOver ? button.onMouseOver : () => {}}
                  onMouseLeave={button.onMouseLeave ? button.onMouseLeave : () => {}}
                  onClick={button.callback ? button.callback : () => {}}
                >
                  {button.image && button.image}
                  {button.label && button.label}
                </div>
                {index !== buttons.length - 1 && <div className={styles.divider}></div>}
              </React.Fragment>
            )
          })}
        </div>
      </CircleButtonWrapper>
    );
};

export default UnitedButton;