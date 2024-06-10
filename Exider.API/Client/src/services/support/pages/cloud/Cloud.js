import React from 'react';
import Paragraph from '../../shared/paragraph/Paragraph';
import ScreenShot from '../../shared/screen-shot/ScreenShot';
import upload from './images/upload.png';
import deleteImage from './images/delete.png';
import manageAccess from './images/manage-accenss.png';
import Title from '../../shared/title/Title';
import Wrapper from '../../shared/wrapper/Wrapper';

const Cloud = () => {
    return (
        <>
            <Wrapper>
                <Title>Введение</Title>
                <Paragraph>Облачное хранилище - это сервис, который позволяет пользователям сохранять данные на удаленных серверах и получать к ним доступ через интернет. Это удобный способ хранения, резервного копирования и обмена данными.</Paragraph>
            </Wrapper>
            <Wrapper>
                <Title>Управление доступом</Title>
                <Paragraph>Для управления доступом вам необходимо нажать кнопку управление доступом в той папке для которой вы хотите открыть доступ, выберите тип досупа. Внимание! Вы не можете открыть доступ для главной коллекции. Внимание изменения вступят в силу только после сохранения!</Paragraph>
                <ScreenShot image={manageAccess} />
            </Wrapper>
            <Wrapper>
                <Title>Загрузка файлов</Title>
                <Paragraph>После входа в систему выберите опцию “Загрузить файлы”. Выберите файлы на вашем компьютере, которые вы хотите загрузить. Нажмите кнопку “Загрузить” и дождитесь окончания процесса.</Paragraph>
                <ScreenShot image={upload} />
            </Wrapper>
            <Wrapper>
                <Title>Скачивание файлов</Title>
                <Paragraph>Найдите файл, который вы хотите скачать, в вашем облачном хранилище. Выберите файл и нажмите кнопку “Скачать”. Файл будет скачан на ваш компьютер.</Paragraph>
                <ScreenShot image={deleteImage} />
            </Wrapper>
        </>
    );
 };

export default Cloud;