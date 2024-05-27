import React, { useContext, useEffect, useState } from 'react';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import Content from '../widgets/content/Content';
import Input from '../shared/input/Input';
import Chat from '../widgets/chat/Chat';
import Message from '../shared/message/Message';
import styles from './main.module.css';
import cyraAvatar from './images/cyra.png';
import userState from '../../../../../states/user-state';
import { observer } from 'mobx-react-lite';
import { messageWSContext } from '../../../layout/Layout';
import Chats from '../widgets/chats/Chats';

const Messages = (props) => {
  const { user } = userState;

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(true);
    }
  }, [props.setPanelState]);
  
  return (
    <Content>
      <Chats />
      <Chat />
        {/* <Message 
          name="✦ Сyra"
          text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
          isMyMessage={false}
          avatar={cyraAvatar}
        /> */}
    </Content>
  )

};

export default observer(Messages);