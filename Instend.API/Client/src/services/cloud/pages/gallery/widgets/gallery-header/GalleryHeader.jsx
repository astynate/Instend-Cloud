import styles from './main.module.css'

const GalleryHeader = () => {
    return (
        <div className={styles.header}>
          <div className={styles.up}>
              <div className={styles.rangeWrapper}>
                <Range
                  min={1}
                  max={5}
                  value={scale}
                  setValue={setScale}
                  inc={1}
                />
              </div>
              <Menu 
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
          </div>
        </div>
    );
}

export default GalleryHeader;