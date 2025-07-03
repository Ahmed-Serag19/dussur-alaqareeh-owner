import { useTranslation } from "react-i18next"

const useLanguage = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage,
    isRTL: i18n.language === "ar",
  }
}

export default useLanguage
