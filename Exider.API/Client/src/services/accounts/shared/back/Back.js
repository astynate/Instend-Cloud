import React from 'react';
import './main.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Back = () => {

    const navigation = useNavigate();
    const comeBack = () => navigation(-1);
    const { t } = useTranslation();

    return (

        <span className='back' onClick={comeBack}>{t('account.back')}</span>

    );

}

export default Back;