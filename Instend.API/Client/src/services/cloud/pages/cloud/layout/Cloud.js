import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';
import SubMenu from '../../../features/navigation/sub-menu/SubMenu';
import ContentWrapper from '../../../features/wrappers/content-wrapper/ContentWrapper.jsx';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton.js';
import share from './images/header/account.png';
import download from './images/header/download.png';
import sort from './images/header/sort.png';
import AddInFolder from '../features/add-in-folder/AddInFolder.jsx';
import PopUpField from '../../../shared/popup-windows/pop-up-filed/PopUpField.js';

const Cloud = observer((props) => {
  const [fileName, setFilename] = useState('');
  const [isRenameOpen, setRenameState] = useState(false);
  const [activeItems, setActiveItems] = useState([]);
  const [isNewItem, setNewItemState] = useState();
  const [creationType, setCreationType] = useState({});
  const params = useParams();
  const selectPlaceWrapper = useRef();

  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false); 
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.wrapper} ref={selectPlaceWrapper}>
      <Header>
        <Search />
        <SubMenu 
          items={[
            { name: 'Main', route: '/cloud' },
            { name: 'Publications', route: '/cloud/publications' },
            { name: 'Messages', route: '/cloud/messages' },
          ]}
        />
      </Header>
      <ContentWrapper>
        <div className={styles.header}>
            <UnitedButton
                buttons={[
                  { 
                    label: 'Open access', 
                    image: <img src={share} draggable="false" /> 
                  }
                ]}
            />
            <UnitedButton
                buttons={[
                  { 
                    label: 'Download', 
                    image: <img src={download} draggable="false" /> 
                  },
                  { 
                    label: 'Name', 
                    image: <img src={sort} draggable="false" /> 
                  },
                ]}
            />
        </div>
      </ContentWrapper>
      <PopUpField
        title={creationType.title}
        text={creationType.text}
        field={[fileName, setFilename]}
        placeholder={creationType.placeholder}
        open={isNewItem}
        close={() => setNewItemState(false)}
        callback={() => {}}
      />
      <AddInFolder 
        OpenDialog={(type) => {
          setNewItemState(true);
          setCreationType(type);
        }}
      />
    </div>
  )
});

export default Cloud;