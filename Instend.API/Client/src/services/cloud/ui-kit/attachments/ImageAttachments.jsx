import { useState, useEffect } from 'react';
import styles from './main.module.css';
import TypeHelper from './helpers/TypeHelper';
import ColumnsTemplate from './components/ColumnsTemplate/ColumnsTemplate';
import HorizontalGridTemplate from './components/HorizontalGridTemplate/HorizontalGridTemplate';
import VerticalGridTemplate from './components/VerticalGridTemplate/VerticalGridTemplate';
import GlobalContext from '../../../../global/GlobalContext';
import Preview from '../../../preview/layout/Preview';

const ImageAttachments = ({attachments = [], isEditable = false, setAttachments = () => {}}) => {
    const [isPreviewOpen, setPreviewOpenState] = useState(false);
    const [index, setIndex] = useState(0);
    const [imageAttachments, setImageAttachments] = useState([]);

    useEffect(() => {
        const filteredAttachments = attachments
            .filter(e => GlobalContext.supportedImageTypes.includes(e.type));

        setImageAttachments(filteredAttachments);
    }, [attachments]);

    const handlers = [
        { condition: async () => await TypeHelper.IsColumnTemplate(imageAttachments), handler: ColumnsTemplate },
        { condition: async () => await TypeHelper.IsHorizontalGridTemplate(imageAttachments), handler: HorizontalGridTemplate },
        { condition: async () => await TypeHelper.IsVerticalGridTemplate(imageAttachments), handler: VerticalGridTemplate }
    ];

    const [CurrentHandler, setCurrentHandler] = useState(() => handlers[0].handler);

    useEffect(() => {
        const DetermineHandler = async () => {
            for (const handler of handlers) {
                try {
                    const result = await handler.condition();
                
                    if (result) {
                        setCurrentHandler(() => handler.handler);
                        break;
                    }
                }
                catch (exception) {
                    console.error('Error while trying to detemine the image template.');
                    console.error(exception);
                }
            }
        };

        if (imageAttachments.length > 0) {
            DetermineHandler();
        };
    }, [imageAttachments]);

    if (imageAttachments.length === 0) {
        return null;
    };

    return (
        <div className={styles.attachments}>
            {isPreviewOpen && <Preview 
                close={() => setPreviewOpenState(false)}
                files={attachments}
                index={index}
            />}
            <CurrentHandler
                key={attachments.length} 
                attachments={attachments} 
                isEditable={isEditable}
                setAttachments={setAttachments}
                imageCallback={(index) => {
                    setIndex(index);
                    setPreviewOpenState(true);
                }}
            />
        </div>
    );
};

export default ImageAttachments;