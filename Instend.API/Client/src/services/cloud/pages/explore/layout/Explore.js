import React, { useEffect } from 'react';
import styles from './main.module.css';
import Header from '../../../widgets/header/Header';
import Search from '../../../widgets/search/Search';

const Explore = (props) => {
  useEffect(() => {
    if (props.setPanelState) {
      props.setPanelState(false);
    }
  }, [props.setPanelState]);

  return (
    <div className={styles.explore}>
      <Header />
      <Search />
      <Title value="People" />
      <ExploreItems>
          {exploreState.users.map((element, index) => {
              if (element && element.id && element.id !== userState.user.id) {
                  return (
                      <User 
                          key={index} 
                          id={element.id}
                          avatar={element.avatar}
                          nickname={element.nickname}
                          name={`${element.name} ${element.surname}`}
                          coins={element.balance}
                          friends={element.friendCount}
                          space={ConvertBytesToMb(element.storageSpace)}
                      />
                  );
              } else {
                  return null;
              }
          })}
      </ExploreItems>
      <Title value="Files" />
      <ExploreItems>
          {exploreState.files.map((element, index) => {
              return (
                  <File
                      key={element.id ? element.id : index} 
                      name={element.name}
                      file={element}
                      time={element.lastEditTime}
                      image={element.fileAsBytes == "" ? null : element.fileAsBytes}
                      type={element.type}
                      isLoading={element.isLoading}
                      isSelected={false}
                      onClick={() => {}}
                      onContextMenu={() => {}}
                  />
              );
          })}
      </ExploreItems>
    </div>
  );
}

export default Explore;