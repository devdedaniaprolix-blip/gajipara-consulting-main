import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../config/api";

const ServiceCard = ({ service }) => {
  const location = useLocation();
  const localePrefix = location.pathname.startsWith("/en") ? "/en" : "";

  const { t } = useTranslation();

  if (!service) return null;

  const { slug, title, description, image } = service;

  const imageUrl = image?.url ? `${BASE_URL}${image.url}` : null;

  const getFullSentences = (text, maxLength = 150) => {
    if (!text) return "";
    const trimmed = text.substring(0, maxLength);
    const lastDot = trimmed.lastIndexOf(".");
    return lastDot !== -1 ? trimmed.substring(0, lastDot + 1) : trimmed;
  };

  return (
    <div
      className="
        flex flex-col
        h-full
        bg-white
        rounded-[28px]
        overflow-hidden
        border border-gray-100
        shadow-[0_15px_35px_rgba(0,0,0,0.06)]
        transition-all duration-300
        hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]
        hover:-translate-y-1
      "
    >
      {/* Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="
        w-full
        h-[250px]
        object-cover
        object-center
        rounded-t-[30px]
        transition-transform
        duration-500
        hover:scale-105
      "
          />
        ) : (
          <div className="w-full h-[250px] bg-gray-200 rounded-t-[30px]" />
        )}

      {/* Content */}
      <div className="flex flex-col flex-1">

        <h3
          className="p-[20px] text-lg font-title sm:text-xl font-bold"
          style={{ color: "var(--e-global-color-secondary)" }}
        >
          {title}
        </h3>

        <p className="px-[15px] pb-[15px] text-lg leading-relaxed font-desc text-(--e-global-color-text)">
          {getFullSentences(description)}
        </p>
      </div>
    
       {/* Read More */}
        <Link
          to={`${localePrefix}/${slug}`}
          className="
            mt-auto
            px-[20px]
            pb-[15px]
            text-sm font-semibold
            inline-flex items-center gap-1
            text-(--orange)
            transition-all duration-300
            hover:gap-2
            font-desc
          "
        >
          {t("readmore")}
          <span className="transition-transform hover:translate-x-1">
            <i className="fa-solid fa-angle-right"></i>
          </span>
        </Link>

    </div>
  );
};

export default ServiceCard;