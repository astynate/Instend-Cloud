import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import close from './images/close.png';
import panel from './images/panel.png';
import { instance } from '../../../../../../state/Interceptors';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';
import ElementBar from '../../shared/element-bar/ElementBar';
import ItemList from '../../../../widgets/item-list/ItemList';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import FileInformation from '../../shared/file-information/FileInformation';

const RightPanel = observer((props) => {
    const rightPanel = useRef();
    const [isLoading, setLoadingState] = useState(true);
    const [activeFile, setActiveFile] = useState(props.file);
    const [current, setCurrent] = useState("Preview");
    const [isPanelOpen, setPanelState] = useState(true);
    const [file] = useState(props.file);

    let Elements = {
        "Preview": <div className={styles.file}></div>,
        "Information": <h1>!!!</h1>,
    }

    const [elements, setElements] = useState(Elements);

    useEffect(() => {
        const GetFile = async () => {
            try {
                const response = await instance
                .get(`/file?id=${file.id}`);
                
                if (response.status === 200){
                    setLoadingState(false);

                    let Elements = {
                        "Preview": <div className={styles.file} dangerouslySetInnerHTML={{ __html: response.data }}></div>,
                        "Information": <FileInformation 
                                            file={activeFile} 
                                            items={[
                                                ["Name", activeFile.name],
                                                ["Type", activeFile.type],
                                                ["Creation time", ConvertFullDate(activeFile.creationTime)],
                                                ["Last edit time", ConvertFullDate(activeFile.lastEditTime)],
                                                ["Access", activeFile.accessId]
                                            ]}
                                        />
                    }

                    setElements(Elements);
                } else {
                    setLoadingState(false);
                }
            } catch (error) {
                console.warn(error);
            }
        };

        if (props.file && props.file.id) {
            GetFile();
        }
    }, [props.file]);

    useEffect(() => {
        const SetActiveAsync = () => {
            if (activeFile) {
                setElements(prevElements => ({
                    ...prevElements,
                    "Preview": <div className={styles.file} dangerouslySetInnerHTML={{ __html: `<img src="data:image/png;base64,${activeFile.fileAsBytes}" />` }}></div>,
                    "Information": <FileInformation 
                                        file={activeFile} 
                                        items={[
                                            ["Name", activeFile.name],
                                            ["Type", activeFile.type],
                                            ["Creation time", ConvertFullDate(activeFile.creationTime)],
                                            ["Last edit time", ConvertFullDate(activeFile.lastEditTime)],
                                            ["Access", activeFile.accessId]
                                        ]}
                                    />
                }));
            }
        }

        SetActiveAsync();
    }, [activeFile, setActiveFile]);

    const ChangePanelState = () => {
        setPanelState(prev => !prev);

        if (rightPanel.current) {
            rightPanel.current.style.gridTemplateRows = isPanelOpen ? '100px auto' : '100px auto 80px';
        }
      }; 

    return (
        <div className={styles.rightPanel} ref={rightPanel}>
            <div className={styles.block} id='header'>
                <div className={styles.header}>
                    <img src={panel} className={styles.button} onClick={ChangePanelState} />
                    <div>
                        <div className={styles.filename}>
                            <span className={styles.name}>{activeFile ? activeFile.name : 'Select file'}</span>
                        </div>
                        <span className={styles.time}>{activeFile ? ConvertFullDate(activeFile.lastEditTime) : 'To select file please click on it'}</span>
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
            {isPanelOpen && <div className={styles.block} id='items'>
                <ItemList 
                    id={props.file && props.file.folderId ? props.file.folderId : null}
                    current={props.file && props.file.id ? props.file.id : null}
                    setActive={setActiveFile}
                />
            </div>}
        </div>
    );
 });

export default RightPanel;