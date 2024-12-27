import React, { useState } from 'react';
import styles from './main.module.css';
import MultipleInput from '../../../ui-kit/fields/multiple-input/MultipleInput';
import PublicationControlPanel from '../publication-control-panel/PublicationControlPanel';
import PublicationsController from '../../../api/PublicationsController';
import { observer } from 'mobx-react-lite';

const CommentInputField = observer(({publication = {}}) => {
    const [text, setText] = useState('');

    if (!!publication === false) {
        return null;
    }

    return (
        <div className={styles.inputWrapper}>
            <PublicationControlPanel 
                publicationId={publication.id}
                numberOfReactions={publication.numberOfReactions}
                numberOfComments={publication.numberOfComments}
                numberOfViews={publication.numberOfViews}
            />
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
});

export default CommentInputField;