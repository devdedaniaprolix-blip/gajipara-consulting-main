import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../config/api";

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const location = useLocation();
  const { t } = useTranslation();
  const locale = getLocaleFromPath(location.pathname);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/abouts?populate=*&locale=${locale}`
        );

        const data = await res.json();
        setAbout(data.data?.[0] || null);
      } catch (err) {
        console.error("About fetch error:", err);
      }
    };

    fetchAbout();
  }, [locale]);

  if (!about) {
    return (
      <div className="text-center py-16 sm:py-20 text-gray-500 text-sm sm:text-base">
        Loading...
      </div>
    );
  }

  const description =
    about.description?.[0]?.children?.[0]?.text || "";

  const imageUrl = about.image?.url
    ? `${BASE_URL}${about.image.url}`
    : "";

  const whatsappLink = `https://wa.me/${about.whatsappNumber}?text=${encodeURIComponent(
    "Hello"
  )}`;

  return (
    <section className="pt-[150px] pb-[80px] bg-[#FAFAFA]">
      <div className="w-full max-w-[562px] lg:max-w-[1200px] mx-auto px-[15px] lg:px-0 flex flex-col lg:flex-row items-center">
        {/* IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center px-[15px]">
          <img
            src={imageUrl}
            alt={about.name}
            className="w-full max-w-[600px] lg:max-w-full rounded-3xl shadow-lg object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="w-full max-w-[620px] lg:max-w-none lg:w-1/2 text-left px-[15px] mt-8 lg:mt-0 mx-auto">

          <div className="flex justify-left mb-5">
            <h2 className="service-title text-[48px] font-semibold">
              <span>{locale === "en" ? "About Us" : "Über Uns"}</span>
            </h2>
          </div>


          <h3 className="text-[20px] font-semibold text-(--e-global-color-secondary) mb-2.5 font-title">
            {about.name}
          </h3>

          <p className="text-[#3C3C3C] leading-relaxed mb-2 text-[18px] font-desc">
            {description}
          </p>

          <div className="mb-5">
            <p className="font-bold text-(--e-global-color-secondary) text-[20px] mb-[10px] font-title">
              {locale === "en" ? "Location" : "Standort"}
            </p>
            <p className="text-[#3C3C3C] text-[18px] mb-[8px] font-desc">
              {about.location}
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2
             bg-[#41AA36] hover:bg-[#248D32] text-white
             px-[25px] py-[13px]
             text-[16px] leading-none
             rounded-full
             font-normal
             shadow
             transition-all duration-300
             font-title"
          >
            <i className="fa-brands fa-whatsapp text-[18px]"></i>
            <span>{t("whatsApp_Chat")}</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default AboutPage;