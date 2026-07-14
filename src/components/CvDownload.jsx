import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CvDownload = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const localePrefix = location.pathname.startsWith("/en") ? "/en" : "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    error: false,
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setStatus({ submitting: true, error: false, success: false });

    // Simulate submission failure on frontend side as requested (without depending on backend)
    setTimeout(() => {
      setStatus({ submitting: false, error: true, success: false });
    }, 1000);
  };

  return (
    <section id="cv_download" className="pb-20 pt-20 bg-[#F6FCFF]">
      <div className="w-full max-w-[562px] lg:max-w-[850px] mx-auto px-[25px] lg:px-0">

        {/* Heading */}
        <div className="flex justify-center mb-5">
          <h2 className="service-title text-[40px] lg:text-[48px] font-semibold">
            <span>{t("cvTitle")}</span>
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-10 font-desc w-full mx-auto">

          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("cvName")}
            required
            className="w-full h-14 px-6 rounded-full text-[16px]
            placeholder:text-[#7a7a7a]
            border border-[#d0d5d8]
            focus:border-(--orange)
            bg-[#FFFF]
            outline-none transition mb-7 md:mb-8"
          />

          {/* Email + Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 lg:gap-y-0 gap-x-0 lg:gap-x-8">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("cvEmail")}
              required
              className="w-full h-14 px-6 rounded-full text-[16px]
              placeholder:text-[#7a7a7a]
              border border-[#d0d5d8]
              bg-[#FFFF]
              focus:border-(--orange)
              outline-none transition mb-7 md:mb-8"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("cvMessage")}
            required
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
          </p>

          {/* Button */}
          <div className="flex flex-col items-center pt-4 pb-4">
            <button
              type="submit"
              disabled={status.submitting}
              className="bg-(--e-global-color-secondary) hover:bg-(--e-global-color-primary) disabled:bg-gray-400 text-white px-12 py-3 rounded-full text-[16px] font-medium transition duration-300 cursor-pointer"
            >
              {status.submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                t("cvDownloadBtn")
              )}
            </button>

            {/* Error Message Box */}
            <AnimatePresence>
              {status.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 w-full max-w-[500px] p-4 text-center border border-[#ff5353] bg-[#fff3f3] text-[#d93838] rounded-[20px] font-desc text-[15px]"
                >
                  {t("cvErrorMsg")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </form>
      </div>
    </section>
  );
};

export default CvDownload;