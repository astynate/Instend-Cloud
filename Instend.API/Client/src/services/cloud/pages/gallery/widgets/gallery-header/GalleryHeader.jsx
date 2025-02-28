import SubMenu from '../../../../features/navigation/sub-menu/SubMenu';
import styles from './main.module.css'

const GalleryHeader = ({scale}) => {
    return (
        <div className={styles.header}>
          <SubMenu
            items={[
              {
                'name': 'Photos', 
                'route': '/gallery'
              }, 
              {
                'name': 'Albums', 
                'route': '/gallery/albums'
              }
            ]}
          />
          {/* <div className={styles.up}>
              <div className={styles.rangeWrapper}>
                <Range
                  min={1}
                  max={5}
                  value={scale}
                  setValue={setScale}
                  inc={1}
                />
              </div>
            {!props.isMobile && <div className={styles.buttons}>
              <SelectItems 
                icon={sort}
                items={[PhotosSortState, SortingOrderState]}
                states={[setSortingTypeState, setSortingOrderState]}
              />
              <SelectItems icon={grid} 
                items={[template]}
                states={[setTemplate]}
              />
            </div>}
          </div> */}
        </div>
    );
};

export default GalleryHeader;