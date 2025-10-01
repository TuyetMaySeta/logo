import { useEffect, useState } from "react";
import i18n from "@/i18n"; // import i18n instance bạn đã config

export function useLanguage() {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleChange = (lng: string) => setLanguage(lng);
    i18n.on("languageChanged", handleChange);
    return () => {
      i18n.off("languageChanged", handleChange);
    };
  }, []);

  return language;
}
