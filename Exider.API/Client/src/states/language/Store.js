import { createStore } from 'redux';
import languages from './Languages';
import { GetCurrentLanguage, IsLanguageSelected } from './Operations';

const initialState = {
    currentLanguage: GetCurrentLanguage(),
    selectedLanguage: GetCurrentLanguage(),
    isLanguageSelect: IsLanguageSelected(),
    languages: languages
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        selectedLanguage: action.payload,
      };
    default:
      return state;
  }
};

const languageStore = createStore(reducer);

export default languageStore;