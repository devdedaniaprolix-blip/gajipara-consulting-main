import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../config/api";

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";

const getLocalePrefix = (locale) => (locale === "en" ? "/en" : "");

const DevelopmentCard = ({ development }) => {
  const { t } = useTranslation();
  const location = useLocation();

  if (!development) return null;

  const routeLocale = getLocaleFromPath(location.pathname);
  const localePrefix = getLocalePrefix(routeLocale);

  const { slug, title, description, image } = development;

  const imageUrl = image?.formats?.medium?.url
    ? `${BASE_URL}${image.formats.medium.url}`
    : image?.url
      ? `${BASE_URL}${image.url}`
      : null;

  // sentence-safe truncate
  const getFullSentences = (text, maxLength = 190) => {
    if (!text) return "";
    const trimmed = text.substring(0, maxLength);
    const lastDot = trimmed.lastIndexOf(".");
    return lastDot !== -1 ? trimmed.substring(0, lastDot + 1) : trimmed;
  };

  return (
    <Link
      to={`${localePrefix}/developments/${slug}`}
      className="group block w-full h-full"
    >
      <div
        className="
          h-[540px] flex flex-col
          bg-white rounded-3xl overflow-hidden
          border border-gray-100 shadow-md
        "
      >
        {/* Image */}
        <div className="relative h-[230px] w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="
        w-full h-full object-cover
        transition-transform duration-700
        
      "
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* Content */}
        <div className="p-[20px] flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-(--e-global-color-secondary) font-title">
            {title}
          </h3>

          <p className="text-(--e-global-color-text) text-[18px] leading-relaxed mt-[10px] mb-[16px] font-desc">
            {getFullSentences(description)}
          </p>

          <span
            className="
              mt-auto text-[16px] font-semibold font-desc
              inline-flex items-center gap-1
              transition-all duration-300
              group-hover:gap-2
              text-(--orange)
            "
          >
            {t("readmore")}
            <span className="transition-transform group-hover:translate-x-1">
              <i className="fa-solid fa-angle-right"></i>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DevelopmentCard;
