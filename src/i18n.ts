import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // load file JSON từ public/locales
  .use(LanguageDetector) // detect ngôn ngữ từ browser/localStorage
  .use(initReactI18next) // gắn vào React
  .init({
    fallbackLng: "en",
    ns: ["common", "navbar", "auth", "employee"],
    debug: import.meta.env.DEV, // chỉ bật log khi dev
    interpolation: {
      escapeValue: false, // React đã escape sẵn
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Vite sẽ load từ public/
    },
  });

export default i18n;
