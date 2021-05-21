import I18n from "react-native-i18n";

import defaults from "../config/defaults";

import en from "./locales/en";

// If the language is not English:
// let moment = require("moment"); //load moment module to set local language
// require("moment/locale/fa"); //for import moment local language file during the application build
// moment.locale(defaults.lang); //set moment local language to zh-cn

I18n.fallbacks = true;

I18n.defaultLocale = defaults.lang;

I18n.translations = {
  en,
};

export default I18n;
