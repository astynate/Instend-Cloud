import { createStore } from 'redux';
import { GetCurrentLanguage, IsLanguageSelected } from './Operations';
import GlobalContext from '../../global/GlobalContext';

const initialState = {
    currentLanguage: GetCurrentLanguage(),
    selectedLanguage: GetCurrentLanguage(),
    isLanguageSelect: IsLanguageSelected(),
    isAuthenticated: false,
    languages: GlobalContext.supportedLanguages
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        selectedLanguage: action.payload,
      };
    case 'SET_AUTHORIZE_STATE':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;