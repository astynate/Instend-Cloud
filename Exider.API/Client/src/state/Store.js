import { createStore } from 'redux';
import languages from './Languages';
import { GetCurrentLanguage, IsLanguageSelected, GetAuthorizationState } from './Operations';

const initialState = {
    currentLanguage: GetCurrentLanguage(),
    selectedLanguage: GetCurrentLanguage(),
    isLanguageSelect: IsLanguageSelected(),
    isAuthenticated: false,
    languages: languages
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