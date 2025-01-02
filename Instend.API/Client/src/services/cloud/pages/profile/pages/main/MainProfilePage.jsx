import NewsController from '../../../../../../api/NewsController';
import AccountState from '../../../../../../state/entities/AccountState';
import ProfileInformationBlock from '../../../../elements/profile/profile-information-block/ProfileInformationBlock';
import PublicationList from '../../../../features/lists/publication-list/PublicationList';
import styles from './main.module.css';

const MainProfilePage = ({
        publications = [], 
        isHasMore = false, 
        setPublications = () => {}, 
        setHasMoreState = () => {}
    }) => {

    const { account } = AccountState;

    return (
        <div className={styles.wrapper}>
            <div className={styles.blocksWrapper}>
                <div className={styles.blocks}>
                    <ProfileInformationBlock 
                        title={'Information'}
                        text={account.description ? account.description : 'This user has not updated profile description yet.'}
                    />
                    <ProfileInformationBlock 
                        title={'Photos'}
                    />
                </div>
            </div>
            <div className={styles.publicatios}>
                <PublicationList
                    borderRadius={30}
                    isDivided={true}
                    isHasMore={isHasMore}
                    publications={publications}
                    isHasBorder={false}
                    fetchRequest={(date) => NewsController.GetAccountPublications(
                        account.id,
                        date,
                        setPublications,
                        setHasMoreState
                    )}
                />
            </div>
        </div>
    );
};

export default MainProfilePage;