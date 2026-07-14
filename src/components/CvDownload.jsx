import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const CvDownload = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const localePrefix = location.pathname.startsWith("/en") ? "/en" : "";

  return (
    <section id="cv_download" className="pb-20 pt-20 bg-[#F6FCFF]">
      <div className="w-full max-w-[562px] lg:max-w-[850px] mx-auto px-[25px] lg:px-0">

        {/* Heading */}
        <div className="flex justify-center mb-5">
          <h2 className="service-title text-[48px] font-semibold">
            <span>{t("cvTitle")}</span>
          </h2>
        </div>

        {/* Form */}
        <form className="mt-10 font-desc w-full mx-auto">

          {/* Name */}
          <input
            type="text"
            placeholder={t("cvName")}
            className="w-full h-14 px-6 rounded-full text-[16px]
            placeholder:text-[#7a7a7a]
            border border-[#d0d5d8]
            focus:border-(--orange)
            bg-[#FFFF]
            outline-none transition mb-7 md:mb-8"
          />

          {/* Email + Phone */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <input
              type="email"
              placeholder={t("cvEmail")}
              className="w-full h-14 px-6 rounded-full text-[16px]
              placeholder:text-[#7a7a7a]
              border border-[#d0d5d8]
              bg-[#FFFF]
              focus:border-(--orange)
              outline-none transition mb-7 md:mb-8"
            />

            <input
              type="text"
              placeholder={t("cvPhone")}
              className="w-full h-14 px-6 rounded-full text-[16px]
              placeholder:text-[#7a7a7a]
              border border-[#d0d5d8]
              bg-[#FFFF]
              focus:border-(--orange)
              outline-none transition mb-7 md:mb-8"
            />
          </div>

          {/* Message */}
          <textarea
            placeholder={t("cvMessage")}
            rows="5"
            className="w-full rounded-[20px] px-6 py-5 text-[16px]
            placeholder:text-[#7a7a7a]
            border border-[#d0d5d8]
            bg-[#FFFF]
            focus:border-(--orange)
            outline-none resize-none transition mb-7 md:mb-8"
          ></textarea>

          {/* Data Protection */}
          <p className="max-w-[520px] text-[16px] text-[#2f2f2f] leading-7">
            {t("cvPolicy")}{" "}
            <Link
              to={`${localePrefix}/data-protection`}
              className="text-(--orange) font-bold hover:underline cursor-pointer"
            >
              {t("cvDataProtection")}
            </Link>{" "}
            {t("cvPolicyEnd")}
          </p>

          {/* Button */}
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="submit"
              className="bg-(--e-global-color-secondary) hover:bg-(--e-global-color-primary) text-white px-12 py-3 rounded-full text-[16px] font-medium transition duration-300"
            >
              {t("cvDownloadBtn")}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default CvDownload;