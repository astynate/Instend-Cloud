import { useState, useEffect } from 'react';
import styles from './main.module.css';
import TypeHelper from './helpers/TypeHelper';
import ColumnsTemplate from './components/ColumnsTemplate/ColumnsTemplate';
import HorizontalGridTemplate from './components/HorizontalGridTemplate/HorizontalGridTemplate';
import VerticalGridTemplate from './components/VerticalGridTemplate/VerticalGridTemplate';

const Attachments = ({attachments = []}) => {
    const handlers = [
        { condition: async () => await TypeHelper.IsColumnTemplate(attachments), handler: ColumnsTemplate },
        { condition: async () => await TypeHelper.IsHorizontalGridTemplate(attachments), handler: HorizontalGridTemplate },
        { condition: async () => await TypeHelper.IsVerticalGridTemplate(attachments), handler: VerticalGridTemplate }
    ];

    const [CurrentHandler, setCurrentHandler] = useState(() => handlers[0].handler);

    useEffect(() => {
        const DetermineHandler = async () => {
            for (const handler of handlers) {
                const result = await handler.condition();
                
                if (result) {
                    setCurrentHandler(() => handler.handler);
                    break;
                }
            }
        };

        DetermineHandler();
    }, [attachments]);

    return (
        <div className={styles.attachments}>
            <CurrentHandler attachments={attachments} />
        </div>
    );
};

export default Attachments;