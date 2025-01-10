import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GlobalLinks } from '../../../../../../global/GlobalLinks';
import NewsController from '../../../../../../api/NewsController';
import ProfileInformationBlock from '../../../../elements/profile/profile-information-block/ProfileInformationBlock';
import PublicationList from '../../../../features/lists/publication-list/PublicationList';
import arrow from './images/arrow.png';
import styles from './main.module.css';
import StorageController from '../../../../../../api/StorageController';
import AccountController from '../../../../../../api/AccountController';

const MainProfilePage = ({
        account,
        publications = [], 
        isHasMore = false, 
        setPublications = () => {}, 
        setHasMoreState = () => {},
        setCurrent = () => {}
    }) => {

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        setPhotos([]);

        if (account && account.id) {
            AccountController.GetAccountPhotos(
                account.id,
                setPhotos,
                0
            );
        }
    }, [account]);

    if (!!account === false) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.blocksWrapper}>
                <div className={styles.blocks}>
                    <ProfileInformationBlock 
                        title={'Information'}
                        text={account.description ? account.description : 'This user has not updated profile description yet.'}
                        content={
                            <div className={styles.links}>
                                {account.links && account.links.length && account.links.map(link => {
                                    return (
                                        <Link key={link.id} className={styles.link} to={link.link}>
                                            <img 
                                                className={styles.linkImage}
                                                src={GlobalLinks[link.linkId].image}
                                                draggable="false" 
                                            />
                                            <span className={styles.name} style={{color: GlobalLinks[link.linkId].color}}>{link.name}</span>
                                            <img src={arrow} draggable="false" className={styles.arrow} />
                                        </Link>
                                    )
                                })}
                            </div>
                        }
                    />
                    <ProfileInformationBlock 
                        title={'Photos'}
                        button={{
                            label: 'Show all',
                            callback: () => setCurrent(1)
                        }}
                        content={
                            <div className={styles.photos}>
                                {photos.map(photo => {
                                    return (
                                        <img 
                                            key={photo.id}
                                            draggable="false"
                                            className={styles.photo}
                                            src={StorageController.getFullFileURL(photo.path)} 
                                        />
                                    )
                                })}
                            </div>
                        }
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