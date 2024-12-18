import React, { useState } from 'react';
import styles from './main.module.css';
import MultipleInput from '../../../ui-kit/fields/multiple-input/MultipleInput';
import PublicationControlPanel from '../publication-control-panel/PublicationControlPanel';
import PublicationsController from '../../../api/PublicationsController';

const CommentInputField = ({publication = {}}) => {
    const [text, setText] = useState('');

    return (
        <div className={styles.inputWrapper}>
            <PublicationControlPanel />
            <hr />
            <div className={styles.block}>
                <MultipleInput 
                    value={text}
                    setValue={setText}
                    placeholder="Input you comment text"
                />
                <button 
                    className={styles.send}
                    onClick={async () => {
                        await PublicationsController.Comment(publication.id, text);
                        setText('');
                    }}
                >Send</button>
            </div>
        </div>
    );
}

export default CommentInputField;