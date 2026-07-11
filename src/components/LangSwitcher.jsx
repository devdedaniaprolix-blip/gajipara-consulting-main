import { useState } from "react";
import usFlag from "../assets/en.jpg";
import deFlag from "../assets/de.jpg";

const languages = [
  {
    code: "en",
    label: "English",
    flag: usFlag,
  },
  {
    code: "de",
    label: "Deutsch",
    flag: deFlag,
  },
];

export default function LangSwitcher({
  routeLocale,
  changeLanguage,
  setMobileOpen,
  mobile = false,
}) {
  const [open, setOpen] = useState(false);
  const currentLang =
    languages.find((lang) => lang.code === routeLocale) || languages[0];

  if (mobile) {
    return (
      <div className="mt-8">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center text-[20px] font-semibold"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentLang.flag}
              alt="flag"
              className="w-6 h-4 object-cover"
            />
            <span>{currentLang.label}</span>
          </div>
          <span className="text-(--orange) text-3xl leading-none">
            {open ? "−" : "+"}
          </span>
        </button>

        {open && (
          <div className="mt-4 space-y-4 pl-2 text-[18px]">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={async () => {
                  await changeLanguage(language.code);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left"
              >
                <img
                  src={language.flag}
                  alt={language.code}
                  className="w-6 h-4 object-cover"
                />
                {language.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group py-0">
      <button className="flex items-center font-medium hover:text-(--orange) transition cursor-pointer">
        <img
          src={currentLang.flag}
          alt="flag"
            className="w-[16px] h-[11px] object-cover mr-2"
        />
        {currentLang.label}
        <span className="text-(--orange) pl-0.5 text-[10px] transition-transform duration-300 group-hover:rotate-90 inline-block">
          <i className="fa-solid fa-angle-right"></i>
        </span>
      </button>

      <div className="absolute right-0 mt-3 w-44 bg-[#ffffff] text-(--header-menu-dropdown-item-txt-color) rounded-xl shadow-xl py-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center gap-3 px-4 py-2 w-full hover:text-(--orange) transition cursor-pointer text-left"
          >
            <img
              src={language.flag}
              alt={language.code}
              className="w-6 h-4 object-cover"
            />
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
