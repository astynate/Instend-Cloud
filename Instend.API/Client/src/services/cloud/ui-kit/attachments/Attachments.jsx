import { useState, useEffect } from 'react';
import styles from './main.module.css';
import TypeHelper from './helpers/TypeHelper';
import ColumnsTemplate from './components/ColumnsTemplate/ColumnsTemplate';
import HorizontalGridTemplate from './components/HorizontalGridTemplate/HorizontalGridTemplate';
import VerticalGridTemplate from './components/VerticalGridTemplate/VerticalGridTemplate';
import i1 from './1.png';
import i2 from './2.jpg';
import i3 from './3.jpg';
import i4 from './4.jpg';
import i5 from './5.jpg';
import i6 from './6.jpg';
import i7 from './7.jpg';

const Attachments = ({attachments = [i3, i4, i5]}) => {
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

                console.log(result, handler);
                
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