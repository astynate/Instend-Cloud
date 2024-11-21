import React, { useState } from 'react';
import styles from './main.module.css';
import MultipleInput from '../../../ui-kit/fields/multiple-input/MultipleInput';
import PublicationControlPanel from '../publication-control-panel/PublicationControlPanel';

const CommentInputField = ({}) => {
    const [text, setText] = useState('');

    return (
        <div className={styles.inputWrapper}>
            {/* <hr /> */}
            <PublicationControlPanel />
            <hr />
            <div className={styles.block}>
                <MultipleInput 
                    value={text}
                    setValue={setText}
                    placeholder="Input you comment text"
                />
                <button className={styles.send}>Send</button>
            </div>
        </div>
    );
}

export default CommentInputField;