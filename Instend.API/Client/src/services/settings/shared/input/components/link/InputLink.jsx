import { useState } from 'react';
import { GlobalLinks } from '../../../../../../global/GlobalLinks';
import styles from '../../main.module.css';
import remove from './images/remove.png';

const InputLink = ({id, value, setValue, maxLength, isEditable = true}) => {
    const [isIconMenuOpen, setIconMenuOpenState] = useState(false);

    const deleteLink = () => {
        if (!!id === false) {
            return;
        }

        setValue(prev => prev.filter(e => e.id !== id))
    }

    const setLink = (callback) => {
        setValue(prev => {
            return prev.map(link => {
                if (link.id === id) {
                    return callback(link);
                }
                
                return link;
            });
        });
    }

    const setLinkName = (event) => {
        setLink(prev => {
            if (!!prev === true) {
                prev.name = event.target.value;
            }

            return prev;
        });
    }

    const setLinkUrl = (event) => {
        setLink(prev => {
            if (!!prev === true) {
                prev.url = event.target.value;
            }

            return prev;
        });
    }
    
    const setLinkIcon = (iconId) => {
        setLink(prev => {
            if (!!prev === true) {
                prev.icon = iconId;
            }

            return prev;
        });
    }
    
    return (
        <div className={styles.link}>
            <div 
                className={styles.icon} 
                onClick={() => setIconMenuOpenState(p => !p)}
            >
                <img 
                    draggable="false" 
                    src={GlobalLinks[value && value.icon ? value.icon : '00000000-0000-0000-0000-000000000001'].image} 
                />
                {isIconMenuOpen && isEditable && <div className={styles.icons}>
                    {Object.entries(GlobalLinks).map(link => {
                        return (
                            <div 
                                state={link[1].isInverted ? 'inverted' : null}
                                className={styles.iconButton} 
                                key={link[0]}
                                onClick={() => setLinkIcon(link[0])}
                            >
                                <img 
                                    draggable="false"
                                    src={link[1].image} 
                                />
                            </div>
                        )
                    })}
                </div>}
            </div>
            <input 
                placeholder={'facebook'}
                value={isEditable === false ? '' : value && value.name && value.name}
                id={isEditable === false ? 'disabled' : null}
                className={styles.input}
                onChange={setLinkName}
                maxLength={maxLength}
            />
            <input 
                type={"url"}
                placeholder={'https://facebook.com/profile'}
                value={isEditable === false ? '' : value.url}
                id={isEditable === false ? 'disabled' : null}
                className={styles.input} 
                onChange={setLinkUrl}
                maxLength={maxLength}
            />
            <div className={styles.icon} onClick={deleteLink}>
                <img draggable="false" src={remove} />
            </div>
        </div>
    );  
};

export default InputLink;