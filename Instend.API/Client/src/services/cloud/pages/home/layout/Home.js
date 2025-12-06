import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import StorageState, { AdaptId } from '../../../../../state/entities/StorageState';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper';
import { useParams } from 'react-router-dom';
import CollectionsArrayTemplate from '../../../templates/collections-array-template/CollectionsArrayTemplate';
import FetchCollectionData from '../../../singletons/fetch-collection-data/FetchCollectionData';
import ItemsWrapper from '../../../features/wrappers/items-wrapper/ItemsWrapper';
import FilesArrayTemplate from '../../../templates/files-array-template/FilesArrayTemplate';

const Home = observer((props) => {
  const params = useParams();
  const { files, collections } = StorageState;
  const [adaptedId, setAdaptedId] = useState(AdaptId(params.id));

  console.log(collections);

  useState(() => {
    setAdaptedId(AdaptId(params.id))
  }, [params.id]);

  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false);
    };
  }, [props.setPanelState]);

  return (
    <div className={styles.home}>
      <Header>
        <Search title="Home" />
      </Header>
      <ContentWrapper>
        <ItemsWrapper>
          <CollectionsArrayTemplate collections={collections} />
          <FilesArrayTemplate files={files} />
          <FetchCollectionData id={params.id} />
        </ItemsWrapper>
      </ContentWrapper>
    </div>
  );
});

export default Home;