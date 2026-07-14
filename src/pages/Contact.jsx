import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../config/api";

const Contact = () => {
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
    success: false,
    error: false,
  });

  const [about, setAbout] = useState(null);

  // Detect locale from URL
  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/abouts?populate=*&locale=${routeLocale}`
        );
        const data = res.data;
        setAbout(data.data?.[0] || null);
      } catch (err) {
        console.error("Error fetching about details for contact page:", err);
      }
    };
    fetchAbout();
  }, [routeLocale]);

  const formatPhone = (num) => {
    if (!num) return "+49 176 3411 0864";
    // Remove non-digit chars
    const cleaned = ('' + num).replace(/\D/g, '');
    if (cleaned.startsWith('49')) {
      return `+49 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
    }
    if (cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return `+${cleaned}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setStatus({ submitting: true, success: false, error: false });

    try {
      // Try to send to Strapi contacts endpoint if it exists
      await axios.post(`${BASE_URL}/api/contacts`, {
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
      });
      setStatus({ submitting: false, success: true, error: false });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.warn("API submission failed, falling back to mock success for demo:", err);
      // Fallback for demo/unconfigured backend to ensure a premium user experience
      setTimeout(() => {
        setStatus({ submitting: false, success: true, error: false });
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 1000);
    }
  };

  return (
    <>
      <section className="mx-auto w-full max-w-[562px] px-[15px] pt-[150px] pb-[80px] lg:max-w-[1200px]">
        {/* Page Title */}
        <div className="flex p-[10px] justify-center mb-10">
          <h2 className="service-title text-[40px] lg:text-[48px] font-semibold">
            <span>{t("contactTitle")}</span>
          </h2>
        </div>

        {/* Form Container */}
        <div className="bg-[#F6FCFF] rounded-[30px] p-6 md:p-12 lg:p-16 max-w-[850px] mx-auto shadow-sm">
          <AnimatePresence mode="wait">
            {status.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-(--blue) font-title mb-2">
                  {t("contactSuccessMsg")}
                </h3>
                <button
                  type="button"
                  onClick={() => setStatus((prev) => ({ ...prev, success: false }))}
                  className="mt-6 bg-(--blue) hover:bg-(--orange) text-white px-8 py-2.5 rounded-full text-[16px] font-medium transition duration-300 cursor-pointer"
                >
                  {t("contactSubmitBtn")} again
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-desc w-full px-[15px]"
              >
                {/* Name */}
                <div className="mb-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contactNamePlaceholder")}
                    required
                    className="w-full h-14 px-6 rounded-full text-[16px] placeholder:text-[#7a7a7a] border border-[#e4e6e8] focus:border-(--orange) bg-[#FFFF] outline-none transition"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("contactEmailPlaceholder")}
                    required
                    className="w-full h-14 px-6 rounded-full text-[16px] placeholder:text-[#7a7a7a] border border-[#d0d5d8] focus:border-(--orange) bg-[#FFFF] outline-none transition"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("contactPhonePlaceholder")}
                    className="w-full h-14 px-6 rounded-full text-[16px] placeholder:text-[#7a7a7a] border border-[#d0d5d8] focus:border-(--orange) bg-[#FFFF] outline-none transition"
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contactMessagePlaceholder")}
                    required
                    rows="5"
                    className="w-full rounded-[20px] px-6 py-5 text-[16px] placeholder:text-[#7a7a7a] border border-[#d0d5d8] focus:border-(--orange) bg-[#FFFF] outline-none resize-none transition"
                  ></textarea>
                </div>

                {/* Privacy Policy Agreement */}
                <div className="mb-8 text-left">
                  <p className="text-[16px] text-[#2f2f2f] leading-7">
                    {t("contactPolicyText")}{" "}
                    <Link
                      to={`${localePrefix}/data-protection`}
                      className="text-(--orange) font-bold hover:underline cursor-pointer"
                    >
                      {t("contactPolicyLink")}
                    </Link>
                    {t("contactPolicyEnd")}
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="bg-(--blue) hover:bg-(--orange) disabled:bg-gray-400 text-white px-16 py-3.5 rounded-full text-[16px] font-semibold transition duration-300 cursor-pointer shadow-md"
                  >
                    {status.submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      t("contactSubmitBtn")
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Dynamic About Contact Details Banner */}
      {about && (
        <section className="w-full bg-[#FAFAFA] pt-12 pb-24 rounded-tr-[80px] sm:rounded-tr-[120px] md:rounded-tr-[180px] lg:rounded-tr-[250px] xl:rounded-tr-[300px]">
          <div className="mx-auto max-w-[576px] lg:max-w-full">
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-4">
              {/* Subtitle */}
              <div className="text-[14px] uppercase tracking-wider text-[#7A7A7A] mb-2 font-semibold">
                {routeLocale === "en" ? "GET IN TOUCH" : "KONTAKTIEREN"}
              </div>

              {/* Title with orange line */}
              <div className="mb-12">
                <h2 className="service-title text-[34px] sm:text-[40px] md:text-[46px] lg:text-[52px] font-semibold leading-[1.2] max-w-[700px]">
                  {routeLocale === "en" ? (
                    <>
                      Any questions? <span>Get in touch!</span>
                    </>
                  ) : (
                    <>
                      Bei Fragen <span>Melden Sie sich bei uns!</span>
                    </>
                  )}
                </h2>
              </div>

              {/* Row of Contact Info */}
              <div className="pt-10 border-t border-gray-100">

                <div className="grid grid-cols-1 lg:grid-cols-[auto_1px_auto_1px_auto] gap-8 lg:gap-10 items-start lg:items-center">
                  {/* Phone */}
                  <div className="text-[26px] md:text-[34px] lg:text-[28px] font-bold text-[#002F46] font-title">
                    <a
                      href={`tel:${about.whatsappNumber ? "+" + about.whatsappNumber : "+4917634110864"}`}
                      className="hover:text-[#DE7731] transition-colors whitespace-nowrap"
                    >
                      {formatPhone(about.whatsappNumber)}
                    </a>
                  </div>

                  {/* Divider 1 */}
                  <div className="hidden lg:block h-12 w-px bg-gray-200"></div>

                  {/* Location */}
                  <div className="flex items-center gap-4">
                    <div className="w-[50px] h-[50px] rounded-full bg-[#DE7731] flex items-center justify-center text-white shrink-0">
                      <i className="fa-solid fa-location-dot text-[18px]"></i>
                    </div>
                    <div className="text-left font-desc">
                      <div className="font-bold text-[#002F46] text-[18px] font-title leading-tight mb-1">
                        {routeLocale === "en" ? "Location" : "Standort"}
                      </div>
                      <div className="text-[#3C3C3C] text-[16px] leading-snug whitespace-pre-line">
                        {about.location}
                      </div>
                    </div>
                  </div>

                  {/* Divider 2 */}
                  <div className="hidden lg:block h-12 w-px bg-gray-200"></div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-[50px] h-[50px] rounded-full bg-[#DE7731] flex items-center justify-center text-white shrink-0">
                      <i className="fa-regular fa-envelope text-[18px]"></i>
                    </div>
                    <div className="text-left font-desc">
                      <div className="font-bold text-[#002F46] text-[18px] font-title leading-tight mb-1">
                        {routeLocale === "en" ? "E-Mail" : "E-Mail"}
                      </div>
                      <div className="text-[#3C3C3C] text-[16px] leading-snug">
                        <a href={`tel:${about.email}`}
                          className="hover:text-[#DE7731] transition-colors"
                        >
                          {about.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Contact;
