import { useEffect } from 'react';
import Publication from '../../components/publication/Publication';
import CommentInputField from '../../elements/publication-elements/comment-input-field/CommentInputField';
import BackButton from '../../features/navigation/back-button/BackButton';
import CommentWrapper from '../../features/wrappers/comment-wrapper/CommentWrapper';
import MainContentWrapper from '../../features/wrappers/main-content-wrapper/MainContentWrapper';
import Header from '../../widgets/header/Header';
import styles from './main.module.css';

const PublicationPage = ({setPanelState}) => {
    useEffect(() => {
        setPanelState(false); 
    }, [setPanelState]);

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
                    <Publication
                        isControlHidden={true} 
                        // isHasPaddings={true}
                    />
                </div>
                <br />
                <div className={styles.wrapper}>
                    <CommentWrapper>
                        <Publication
                            isAttachmentsHidden={true}
                            isHasPaddings={true}
                        />
                    </CommentWrapper>
                    <CommentWrapper>
                        <Publication
                            isAttachmentsHidden={true}
                            isHasPaddings={true}
                        />
                    </CommentWrapper>
                    <CommentWrapper>
                        <Publication
                            isAttachmentsHidden={true}
                            isHasPaddings={true}
                        />
                    </CommentWrapper>
                    <CommentWrapper>
                        <Publication
                            isAttachmentsHidden={true}
                            isHasPaddings={true}
                        />
                    </CommentWrapper>
                </div>
                <div className={styles.inputWrapper}>
                    <div className={styles.input}>
                        <CommentInputField />
                    </div>
                </div>
            </MainContentWrapper>
        </div>
    );
};

export default PublicationPage;