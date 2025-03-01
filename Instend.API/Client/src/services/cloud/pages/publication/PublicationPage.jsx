import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import Publication from '../../components/publication/Publication';
import CommentInputField from '../../elements/publication-elements/comment-input-field/CommentInputField';
import BackButton from '../../features/navigation/back-button/BackButton';
import MainContentWrapper from '../../features/wrappers/main-content-wrapper/MainContentWrapper';
import Header from '../../widgets/header/Header';
import styles from './main.module.css';
import NewsState from '../../../../state/entities/NewsState';
import PublicationsController from '../../api/PublicationsController';
import PublicationsWrapper from '../../features/wrappers/publications-wrapper/PublicationsWrapper';

const PublicationPage = observer(({setPanelState = () => {}}) => {
    const [isOpen, setOpenState] = useState(true);

    let params = useParams();

    useEffect(() => {
        setPanelState(false); 
    }, [setPanelState]);

    useEffect(() => {
        if (params.id) {
            PublicationsController.Get(params.id);
        }
    }, []);

    if (!!NewsState.publication === false) {
        return;
    }

    return (
        <div className={styles.publicationPage}>
            <Header>
                <div className={styles.header}>
                    <BackButton
                        location={'/'}
                        title={'News'}
                    />
                </div>
            </Header>
            <MainContentWrapper>
                <div className={styles.wrapper}>
                    <PublicationsWrapper>
                        <Publication
                            publication={NewsState.publication}
                            isControlHidden={true}
                            // isHasPaddings={true}
                        />
                    </PublicationsWrapper>
                </div>
                <div className={styles.wrapper}>
                    <PublicationsWrapper>
                        <div className={styles.commentsHeader}>
                            <span className={styles.title}>Comments</span>
                            <span className={styles.button} onClick={() => setOpenState(p => !p)}>{isOpen ? 'Hide' : 'Show'}</span>
                        </div>
                    </PublicationsWrapper>
                </div>
                {isOpen && <div className={styles.wrapper}>
                    <PublicationsWrapper>
                        {[...NewsState.publication.comments]
                            .sort((a, b) => NewsState.sortByDate(a, b))
                            .map(c => {
                                return (
                                    <Publication
                                        key={c.id}
                                        publication={c}
                                        isControlHidden={true}
                                    />
                                )
                            })}
                    </PublicationsWrapper>
                </div>}
                <div className={styles.inputWrapper}>
                    <div className={styles.input}>
                        <CommentInputField 
                            publication={NewsState.publication}
                        />
                    </div>
                </div>
            </MainContentWrapper>
        </div>
    );
});

export default PublicationPage;