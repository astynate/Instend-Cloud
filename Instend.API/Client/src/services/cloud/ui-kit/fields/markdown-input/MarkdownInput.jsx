import { useRef, useState } from 'react';
import styles from './main.module.css';
import list from './images/list.png';

const MarkdownInput = ({text, setText, rightButtons = []}) => {
    const [formattedText, setFormattedText] = useState(text);
    const [isBold, setBoldState] = useState(false);
    const [isItalic, setItalicState] = useState(false);
    const [isUnderlined, setUnderlinedState] = useState(false);
    const [parentTags, setParentTags] = useState([]);

    let ref = useRef();

    const removeWrapper = (wrapper) => {
        while (wrapper.firstChild) {
            const currentChild = wrapper.firstChild;
    
            if (currentChild.tagName === 'LI') {
                const newDivElement = document.createElement('div');

                newDivElement.innerHTML = currentChild.innerHTML; 
                wrapper.parentNode.insertBefore(newDivElement, wrapper);

                if (wrapper.firstChild) {
                    wrapper.firstChild.remove();   
                }
            } else {
                wrapper.parentNode.insertBefore(currentChild, wrapper);
            }
        }
    
        if (wrapper && wrapper.parentElement) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }

    const setActiveButtons = (currentTag) => {
        if (!currentTag) return;

        let newParentTags = [];
    
        while (currentTag && (currentTag.tagName !== 'DIV' || currentTag.id !== 'input')) {
            newParentTags.push(currentTag);
            currentTag = currentTag.parentElement;
        }

        setParentTags(newParentTags);
        const parentTagNames = newParentTags.map(e => e.tagName);
    
        setBoldState(parentTagNames.includes('B'));
        setItalicState(parentTagNames.includes('I'));
        setUnderlinedState(parentTagNames.includes('U'));
    }

    const addMarkdown = (tag) => {
        const selection = window.getSelection();
    
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const tempContainer = document.createElement('div'); 

            if (range.endOffset === 0) return; 

            setActiveButtons(range.commonAncestorContainer);

            const targetTag = parentTags.find(e => e.tagName === tag.toUpperCase());

            if (targetTag) {
                removeWrapper(targetTag, tag);
            } else {
                tempContainer.appendChild(range
                    .cloneContents());
                
                const newElement = document
                    .createElement(tag);
                
                while (tempContainer.firstChild) {
                    if (tag === 'UL' && tempContainer.firstChild.tagName === 'DIV') {
                        const newLiElement = document.createElement('li');
                        
                        newLiElement.innerHTML = tempContainer.firstChild.innerHTML;
                        newElement.appendChild(newLiElement);
                        tempContainer.firstChild.remove();
                    } else {
                        newElement.appendChild(tempContainer.firstChild);
                    }
                }
        
                range.deleteContents();
                range.insertNode(newElement);
            }

            const divs = ref.current.querySelectorAll('*');

            divs.forEach(div => {
                if (!div.hasChildNodes() || div.innerHTML.trim() === '') {
                    div.remove();
                }
            });

            selection.removeAllRanges();
            setText(ref.current.innerHTML);
        }
    };

    const handleSelection = () => {
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setActiveButtons(range.startContainer.parentElement);
        }
    }
    
    return (
        <div>
            <div
                id='input'
                ref={ref}
                className={styles.input}
                contentEditable
                dangerouslySetInnerHTML={{ __html: formattedText }}
                onSelect={handleSelection}
                onBlur={() => {
                    setBoldState(false);
                    setItalicState(false);
                    setUnderlinedState(false);
                }}
                onInput={(event) => setText(event.target.innerHTML)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
            ></div>
            <div className={styles.control}>
                <div className={styles.buttons}>
                    <button onClick={() => addMarkdown('B')} state={isBold ? 'active' : null}>B</button>
                    <button onClick={() => addMarkdown('I')} state={isItalic ? 'active' : null}>I</button>
                    <button onClick={() => addMarkdown('U')} state={isUnderlined ? 'active' : null}>U</button>
                    <button onClick={() => addMarkdown('UL')}><img src={list} draggable="false" /></button>
                </div>
                <div className={styles.buttons}>
                    {rightButtons.map((button, index) => {
                        return (
                            <button key={index} className={styles.button} onClick={button.callback}>
                                <img src={button.image} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MarkdownInput;