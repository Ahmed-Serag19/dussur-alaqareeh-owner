import { Globe, Check, ChevronDown } from "lucide-react";
import useLanguage from "@/hooks/useLanguage";
import useToggle from "@/hooks/useToggle";
import { useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "en", name: "English", flag: "🇺🇸" },
] as const;

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { value: isOpen, setTrue: open, setFalse: close, toggle } = useToggle();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    close();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="gap-[2px] sm:gap-1 md:gap-2 h-9 px-3 cursor-pointer hover:text-blue-800 bg-white/10 backdrop-blur-sm border border-white/20 text-black hover:bg-white/20 transition-all duration-300 rounded-md flex items-center"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLang.flag}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-md shadow-lg z-50">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-100/80 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
