import logo from "../../src/assets/footer-logo.png";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const localePrefix = location.pathname.startsWith("/en") ? "/en" : "";

  const buildPath = (path) => `${localePrefix}${path}`;

  return (
    <footer className="w-full">

      <div className="bg-(--blue) text-white pt-16 rounded-tr-[180px]">

        <div className="w-full max-w-[1200px] mx-auto px-8 md:px-8 xl:px-0">

          {/* Top Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 ">

            <div className="text-2xl font-semibold tracking-wide">
              <img
                src={logo}
                alt="Logo"
                className="w-auto object-contain"
              />
            </div>

            {/* Social */}
            <div className="flex gap-4 mt-6 md:mt-0">
              <div className="w-11 h-11 flex items-center justify-center rounded-full border border-white cursor-pointer hover:bg-white hover:text-[#083B4C] transition">
                <i class="fa-brands fa-xing"></i>
              </div>

              <div className="w-11 h-11 flex items-center justify-center rounded-full border border-white cursor-pointer hover:bg-white hover:text-[#083B4C] transition">
                <i class="fab fa-linkedin-in"></i>
              </div>
            </div>

          </div>

          <div className="border-t border-[#004668] mb-12"></div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-12 gap-x-16 pb-16">

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4 font-title">{t("footerCompany")}</h3>
              <ul className="space-y-3 text-[#a8b1b5] font-desc">
                <li>
                  <Link to={buildPath("/company#about")} className="hover:text-(--orange) transition">
                    {t("footerAbout")}
                  </Link>
                </li>
                <li>
                  <Link to={buildPath("/company#offshoring")} className="hover:text-(--orange) transition">
                    {t("footerOffshoring")}
                  </Link>
                </li>
                <li>
                  <Link to={buildPath("/company")} className="hover:text-(--orange) transition">
                    {t("footerPartners")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4 font-title">{t("footerLegal")}</h3>
              <ul className="space-y-3 text-[#a8b1b5] font-desc">
                <li>
                  <Link to={buildPath("/imprint")} className="hover:text-(--orange) transition">
                    {t("footerAddress")}
                  </Link>
                </li>
                <li>
                  <Link to={buildPath("/imprint")} className="hover:text-(--orange) transition">
                    {t("footerImprint")}
                  </Link>
                </li>
                <li>
                  <Link to={buildPath("/data-protection")} className="hover:text-(--orange) transition">
                    {t("footerDataProtection")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 font-title">{t("footerQuickLinks")}</h3>
              <ul className="space-y-3 text-[#a8b1b5] font-desc">
                <li>
                  <Link to={buildPath("/sap-ewm")} className="hover:text-(--orange) transition">
                    {t("footerSapEwm")}
                  </Link>
                </li>
                <li>
                  <Link to={buildPath("/blogs")} className="hover:text-(--orange) transition">
                    {t("footerBlogs")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-6 font-title">{t("footerContact")}</h3>

              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/4917634110864?text=" +
                    encodeURIComponent("hello"),
                    "_blank"
                  )
                }
                className="w-full md:max-w-[330px] flex items-center justify-center gap-2 w-full bg-[#41AA36] hover:bg-[#369021] transition text-white font-medium py-3 rounded-full mb-4 font-desc cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp"></i>
                {t("whatsApp_Chat")}
              </button>

              <Link
                to={buildPath("/company/#cv_download")}
                className="w-full md:max-w-[330px] block text-center bg-[#FFFF] text-[#083B4C] font-medium py-3 rounded-full cursor-pointer transition font-desc"
              >
                {t("cvDownload")}
              </Link>

            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-white text-(--blue) text-center py-4 text-sm">
        {t("copyright")}
      </div>

    </footer>
  );
}
