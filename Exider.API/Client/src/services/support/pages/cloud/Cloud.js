import React from 'react';
import Title from '../../../cloud/shared/ui-kit/retractable-panel/title/Title';
import Paragraph from '../../shared/paragraph/Paragraph';
import ScreenShot from '../../shared/screen-shot/ScreenShot';
import upload from './images/upload.png';

const Cloud = () => {
    return (
        <>
            <Title>Введение</Title>
            <Paragraph>Облачное хранилище - это сервис, который позволяет пользователям сохранять данные на удаленных серверах и получать к ним доступ через интернет. Это удобный способ хранения, резервного копирования и обмена данными.</Paragraph>
            <Title>Загрузка файлов</Title>
            <Paragraph>После входа в систему выберите опцию “Загрузить файлы”. Выберите файлы на вашем компьютере, которые вы хотите загрузить. Нажмите кнопку “Загрузить” и дождитесь окончания процесса.</Paragraph>
            <ScreenShot image={upload} />
            <Title>Скачивание файлов</Title>
            <Paragraph>Найдите файл, который вы хотите скачать, в вашем облачном хранилище. Выберите файл и нажмите кнопку “Скачать”. Файл будет скачан на ваш компьютер.</Paragraph>
            <ScreenShot image={upload} />
            <Title>Удаление файлов</Title>
            <Paragraph>Найдите файл, который вы хотите удалить, в вашем облачном хранилище. Выберите файл и нажмите кнопку “Удалить”. Подтвердите свое действие в появившемся окне</Paragraph>
            <ScreenShot image={upload} />
            <Title>Управление доступом</Title>
            <Paragraph>После входа в систему выберите опцию “Загрузить файлы”. Выберите файлы на вашем компьютере, которые вы хотите загрузить. Нажмите кнопку “Загрузить” и дождитесь окончания процесса.</Paragraph>
            <ScreenShot image={upload} />
        </>
    );
 };

export default Cloud;