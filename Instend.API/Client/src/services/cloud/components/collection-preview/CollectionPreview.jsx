import { useState } from 'react';
import ExpandingElementWrapper from '../../features/wrappers/expanding-element-wrapper/ExpandingElementWrapper';
import PopUpItems from '../../shared/popup-windows/pop-up-window/elements/items/PopUpItems';
import styles from './main.module.css';
import MainCollectionPreviewPage from './pages/main/MainCollectionPreviewPage';

const CollectionPreview = ({ collection }) => {
    const [pageIndex, setPageIndex] = useState(0);

    if (!collection) {
        return null;
    };

    console.log(collection.id);

    return (
        <ExpandingElementWrapper targetHeight={pageIndex === 0 ? 550 : 600} targetWidth={pageIndex === 0 ? 900 : 500}>
            <div className={styles.collection}>
                <div className={styles.header}>
                    <h1 className={styles.name}>{collection.name}</h1>
                </div>
                <PopUpItems
                    isCentered={true}
                    currentIndex={0}
                    setExternalActiveIndex={setPageIndex}
                    items={[
                        {
                            title: "Main", 
                            element: <MainCollectionPreviewPage collectionId={collection.id} />,
                        },
                        {
                            title: "Publications", 
                            element: <></>,
                        },
                        {
                            title: "Messages", 
                            element: <></>,
                        },
                    ]}
                />
            </div>
        </ExpandingElementWrapper>
    );
};

export default CollectionPreview;