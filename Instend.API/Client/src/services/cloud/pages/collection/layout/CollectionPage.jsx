import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './main.module.css';
import StorageState from '../../../../../state/entities/StorageState';
import ItemsWrapper from '../../../features/wrappers/items-wrapper/ItemsWrapper';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper';
import CollectionsArrayTemplate from '../../../templates/collections-array-template/CollectionsArrayTemplate';
import FilesArrayTemplate from '../../../templates/files-array-template/FilesArrayTemplate';
import FetchCollectionData from '../../../singletons/fetch-collection-data/FetchCollectionData';
import CloudController from '../../../api/CloudController';
import CollectionsController from '../../../api/CollectionsController';
import Search from '../../../widgets/search/Search';

const CollectionPage = observer(() => {
  const params = useParams();
  const { files, collections } = StorageState;
  const [collection, setCollection] = useState(undefined);

  useEffect(() => {
    CollectionsController.GetCollectionById(params.id, setCollection, () => {});
    CloudController.GetPath(params.id, StorageState.SetPath);
  }, [params.id]);

  if (!!collection === false) {
    return null;
  };

  return (
    <div className={styles.wrapper}>
      <h1>{collection.name}</h1>
      <Search />
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

export default CollectionPage;