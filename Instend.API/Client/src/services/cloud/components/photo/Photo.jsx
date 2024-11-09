import { useState } from 'react';
import styles from './main.module.css';
import SelectUIElements from '../../../../elements/select/SelectUIElements';

const Photo = ({element={}, setSelectedFiles = () => {}}) => {
    const [isSelected, setSelectedState] = useState(false);
    const [isSelectedOpen, setSelectOpenState] = useState(false);

    return (
        <div 
            key={element.id} 
            className={styles.photoWrapper} 
            data={element.id}
            onMouseEnter={() => setSelectOpenState(true)}
            onMouseLeave={() => setSelectOpenState(false)}
        >
            <SelectUIElements
                isSelected={isSelected}
                setSelectedState={setSelectedState}
                isSelectedOpen={isSelectedOpen}
                setSelectedFiles={setSelectedFiles}
                element={element ?? {id: undefined}}
                top={2}
                right={2}
            />
            {element.fileAsBytes || element.preview ?
                <img 
                    className={styles.image}
                    src={`data:image/png;base64,${element.fileAsBytes ? element.fileAsBytes : element.preview}`}
                    draggable="false"
                    // id={selectedItems.map(element => element.id !== null ? element.id : [])
                    //     .includes(element.id ? element.id : null) === true ? 'active' : 'passive'}
                />
            :
                <p className={styles.type}>{element.type ? element.type : "Unknown"}</p>
            }
        </div>
    );
}

export default Photo;