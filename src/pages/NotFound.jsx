import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imgOffshoring from "../assets/img_offshoring.jpg";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";
  const localePrefix = routeLocale === "en" ? "/en" : "";

  useEffect(() => {
    // Add 404 class to body so header knows to switch to dark mode styles
    document.body.classList.add("is-404-page");

    // Scroll to top
    window.scrollTo(0, 0);

    // Sync translation language with current route locale if needed
    if (i18n.language.split("-")[0] !== routeLocale) {
      i18n.changeLanguage(routeLocale);
    }

    return () => {
      document.body.classList.remove("is-404-page");
    };
  }, [routeLocale, i18n]);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center py-16 text-white sm:min-h-[460px] md:min-h-[500px] md:py-0"
        style={{ backgroundImage: `url(${imgOffshoring})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 mx-auto w-full text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-block max-w-full text-center">
            <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight font-extrabold uppercase tracking-wide">
              {t("pageNotFoundTitle")}
            </h1>
            {/* Center Orange Underline */}
            <div className="h-[5px] bg-(--orange) mt-4 mx-auto w-40 sm:w-52 md:w-60"></div>
          </div>

          {/* Breadcrumbs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base font-semibold font-title">
            <Link
              to={localePrefix || "/"}
              className="text-(--orange) hover:underline transition-all duration-300"
            >
              Gajipara Consulting
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-(--orange)">404</span>
          </div>
        </div>
      </section>

      {/* CONTENT AREA */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold font-title mb-6 leading-tight">
            <span className="text-(--e-global-color-secondary)">{t("pageNotFoundOoops")}</span>
            <span className="text-(--orange)">{t("pageNotFoundText")}</span>
          </h2>

          <div className="text-[#3c3c3c] text-[16px] sm:text-[18px] font-desc leading-relaxed mb-10 max-w-[600px] mx-auto space-y-1 font-medium">
            <p>{t("pageNotFoundLine1")}</p>
            <p>{t("pageNotFoundLine2")}</p>
            <p>{t("pageNotFoundLine3")}</p>
          </div>

          <Link
            to={localePrefix || "/"}
            className="inline-block bg-[#5A6774] hover:bg-[#47525E] text-white px-8 py-3.5 rounded-full font-title text-[15px] font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t("pageNotFoundButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
