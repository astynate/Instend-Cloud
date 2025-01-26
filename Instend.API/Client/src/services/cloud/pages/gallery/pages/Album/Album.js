import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import styles from './main.module.css';
// import GalleryState from '../../../../../../state/entities/GalleryState';
// import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';
// import AlbumViewTemplate from '../../../../widgets/album-view-template/AlbumViewTemplate';
// import ScrollElementWithAction from '../../../../elements/scroll-element-with-action/ScrollElementWithAction';
// import PhotoList from '../../../../features/lists/photo-list/PhotoList';

const Album = observer(({}) => {
    // const { albums } = GalleryState;
    // const params = useParams();
    // const wrapper = useRef();

    // useEffect(() => {
//      GalleryState.GetAlbums(); 
//      GalleryState.GetAlbumPhotos(params.id);
    // }, []);

    // return (
    //     <>
    //         <AlbumViewTemplate
    //             uniqItems={[
    //                 {'title': "Photos", 'component': 
    //                     <>
    //                         <AddInGallery id={params.id} /> 
    //                         {!albums[params.id] || !albums[params.id].photos || albums[params.id].photos.length === 0 ?
    //                             <div className={styles.noImages}>
    //                                 {/* <Placeholder title="No photos uploaded" /> */}
    //                             </div>
    //                         :
    //                             <PhotoList
    //                                 photos={GalleryState.albums && GalleryState.albums[params.id] && GalleryState.albums[params.id].photos ? 
    //                                     GalleryState.albums[params.id].photos : []} 
    //                                 scale={scale}
    //                                 photoGrid={photoGrid}
    //                                 forwardRef={wrapper}
    //                             />
    //                         }
    //                         {GalleryState.albums[params.id] &&
    //                             <ScrollElementWithAction
    //                                 scroll={scroll}
    //                                 isHasMore={GalleryState.albums[params.id].hasMore}
    //                                 count={GalleryState.albums[params.id].photos.length}
    //                                 callback={async () => {
    //                                     await GalleryState.GetAlbumPhotos(params.id);
    //                                 }}
    //                             />
    //                         }
    //                     </>
    //                 },
    //             ]}
    //             views={GalleryState.albums[params.id] && GalleryState.albums[params.id].views ? 
    //                 GalleryState.albums[params.id].views : 0}
    //         />
    //     </>
    // );
});

export default Album;