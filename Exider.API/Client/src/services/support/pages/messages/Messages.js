import React from 'react';
import Paragraph from '../../shared/paragraph/Paragraph';
import Title from '../../shared/title/Title';
import ScreenShot from '../../shared/screen-shot/ScreenShot';
import request from './images/request.png';
import response from './images/response.png';

const Messages = () => {
    return (
        <div>
            <Title>Отправка сообщений</Title>
            <Paragraph>Для отправки сообщения вам неободимо нажать кнопку в левом верхнем углу экрана выбрать тип чата который вы хотите создать. Далее напишите ваше сообщение и будет отправлен запрос.</Paragraph>
            <ScreenShot image={request} />
            <Title>Запрос на общение</Title>
            <Paragraph>После отправки запроса вы не сможете отправлять сообщения пока ваш собеседник не примет его. Для принятия запроса необходимо нажать кнопку 'Accept' в нижнем левом углу чата для отклонения запроса необходимо нажать кнопку 'Reject' в правом нижнем углу чата.</Paragraph>
            <ScreenShot image={response} />
        </div>
    );
 };

export default Messages;