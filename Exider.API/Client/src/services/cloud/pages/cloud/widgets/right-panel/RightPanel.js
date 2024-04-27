import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import close from './images/close.png';
import panel from './images/panel.png';
import { instance } from '../../../../../../state/Interceptors';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';
import ElementBar from '../../shared/element-bar/ElementBar';
import ItemList from '../../../../widgets/item-list/ItemList';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

const RightPanel = observer((props) => {
    const [isLoading, setLoadingState] = useState(true);
    const [activeFile, setActiveFile] = useState(null);
    const [file, setFile] = useState(null);
    const [current, setCurrent] = useState("Preview");

    let Elements = {
        "Preview": <div className={styles.file}></div>,
        "Information": <h1>!!!</h1>,
        "Chat": <div></div> 
    }

    const [elements, setElements] = useState(Elements);

    useEffect(() => {
        const GetFile = async () => {
            const response = await instance
                .get(`/file?id=${props.file.id}`);
                
            if (response.status === 200){
                setFile(response.data);
                setLoadingState(false);

                let Elements = {
                    "Preview": <div className={styles.file} dangerouslySetInnerHTML={{ __html: response.data }}></div>,
                    "Information": <h1>!!!</h1>,
                    "Chat": <div></div> 
                }

                setElements(Elements);
            } else {
                setLoadingState(false);
            }
        };

        GetFile();

    }, [props.file]);

    useEffect(() => {
        if (activeFile) {
            setFile(`<img src="data:image/png;base64,${activeFile}" />`);

            let Elements = {
                "Preview": <div className={styles.file} dangerouslySetInnerHTML={{ __html: file }}></div>,
                "Information": <h1>!!!</h1>,
                "Chat": <div></div> 
            }

            setElements(Elements);
        }
    }, [activeFile]);

    return (
        <div className={styles.rightPanel}>
            <div className={styles.block} id='header'>
                <div className={styles.header}>
                    <img src={panel} className={styles.button} />
                    <div>
                        <div className={styles.filename}>
                            <span className={styles.name}>{props.file ? props.file.name : 'Select file'}</span>
                        </div>
                        <span className={styles.time}>{props.file ? ConvertFullDate(props.file.lastEditTime) : 'To select file please click on it'}</span>
                    </div>
                    <img src={close} className={styles.button} onClick={props.close} />
                </div>
                <ElementBar 
                    elements={elements}
                    current={current}
                    setCurrent={setCurrent}
                />
            </div>
            <div className={styles.block}>
                <div className={styles.content}>
                    {elements[current]}
                </div>
            </div>
            <div className={styles.block} id='items'>
                <ItemList 
                    id={props.file && props.file.folderId ? props.file.folderId : null}
                    current={props.file && props.file.id ? props.file.id : null}
                    setActive={setActiveFile}
                />
            </div>
        </div>
    );
 });

export default RightPanel;