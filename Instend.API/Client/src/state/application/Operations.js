import { instance } from './Interceptors';

export const GetCurrentLanguage = () => {
    return localStorage.getItem('i18nextLng');
};

export const IsLanguageSelected = () => {
    return localStorage.getItem('isLanguageSelected') === 'true';
}