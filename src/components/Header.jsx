import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { useTranslation } from "react-i18next";
import usFlag from "../assets/en.jpg";
import deFlag from "../assets/de.jpg";
import { BASE_URL } from "../config/api";

const STATIC_ROOT_SEGMENTS = new Set([
  "home",
  "services",
  "developments",
  "company",
  "blogs",
]);

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";
const getLocalePrefix = (locale) => (locale === "en" ? "/en" : "");
const buildHomePath = (locale) => (locale === "en" ? "/en/home" : "/");

const buildSlugMaps = (items) => {
  const docIdBySlug = {};
  const slugsByDocId = {};

  items.forEach((item) => {
    if (!item?.documentId || !item?.slug || !item?.locale) return;

    slugsByDocId[item.documentId] = {
      ...(slugsByDocId[item.documentId] || {}),
      [item.locale]: item.slug,
    };
    docIdBySlug[item.slug] = item.documentId;

    (item.localizations || []).forEach((loc) => {
      if (!loc?.locale || !loc?.slug) return;
      slugsByDocId[item.documentId][loc.locale] = loc.slug;
      docIdBySlug[loc.slug] = item.documentId;
    });
  });

  return { docIdBySlug, slugsByDocId };
};

function HeaderDropdown({
  label,
  to,
  children,
  align = "center",
  width = "200px",
}) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className="flex items-center gap-1 font-semibold text-[16px]
                   text-(--header-menu-txt-color-first)
                   hover:text-(--header-menu-dropdown-item-txt-color-hover)
                   transition font-title cursor-pointer"
      >
        {label}
        <span className="text-(--orange) text-sm transition-transform duration-300 group-hover:rotate-90 inline-block">
          <i className="fa-solid fa-angle-right"></i>
        </span>
      </Link>

      <div
        className={`
          absolute top-full mt-4
          ${align === "center" ? "left-1/2 -translate-x-1/2" : "right-0"}
          bg-white rounded-2xl shadow-xl py-6 px-5 space-y-5
          opacity-0 invisible translate-y-3
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-300
        `}
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Header() {
  const [data, setData] = useState({ services: [], developments: [] });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scroll, setScroll] = useState({ show: true, lastY: 0 });
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const routeLocale = getLocaleFromPath(location.pathname);
  const localePrefix = getLocalePrefix(routeLocale);

  const serviceSlugMaps = useMemo(
    () => buildSlugMaps(data.services),
    [data.services],
  );
  const developmentSlugMaps = useMemo(
    () => buildSlugMaps(data.developments),
    [data.developments],
  );

  useEffect(() => {
    const currentI18nLocale = i18n.language.split("-")[0];
    if (currentI18nLocale !== routeLocale) i18n.changeLanguage(routeLocale);
  }, [i18n, routeLocale]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, devRes] = await Promise.all([
          fetch(
            `${BASE_URL}/api/services?populate=localizations&sort=order:asc&locale=${routeLocale}`,
          ),
          fetch(
            `${BASE_URL}/api/developments?populate=localizations&sort=order:asc&locale=${routeLocale}`,
          ),
        ]);
        const servicesData = await servicesRes.json();
        const devData = await devRes.json();
        setData({
          services: servicesData.data || [],
          developments: devData.data || [],
        });
      } catch (err) {
        console.error("Header fetch error:", err);
      }
    };
    fetchData();
  }, [routeLocale]);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      setScroll((prev) => ({
        show: !(currentScrollY > prev.lastY && currentScrollY > 80),
        lastY: currentScrollY,
      }));
    };
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const toggleMobileDropdown = (key) =>
    setMobileDropdown((prev) => (prev === key ? null : key));

  const toPrefixedPath = (targetLocale, nakedPath) => {
    if (targetLocale === "en")
      return nakedPath === "/" ? "/en/home" : `/en${nakedPath}`;
    return nakedPath;
  };

  const resolveSlugByLocale = (slug, targetLocale, maps) => {
    const docId = maps.docIdBySlug[slug];
    if (!docId) return slug;
    return maps.slugsByDocId[docId]?.[targetLocale] || slug;
  };

  const changeLanguage = async (targetLocale) => {
    const currentLocale = getLocaleFromPath(location.pathname);
    if (targetLocale === currentLocale) return;

    const strippedPath = location.pathname.startsWith("/en")
      ? location.pathname.replace(/^\/en/, "") || "/"
      : location.pathname;

    const segments = strippedPath.split("/").filter(Boolean);

    if (segments.length === 0 || segments[0] === "home") {
      await i18n.changeLanguage(targetLocale);
      navigate(buildHomePath(targetLocale));
      return;
    }

    if (segments[0] === "developments" && segments[1]) {
      const targetSlug = resolveSlugByLocale(
        segments[1],
        targetLocale,
        developmentSlugMaps,
      );
      await i18n.changeLanguage(targetLocale);
      navigate(
        targetLocale === "en"
          ? `/en/developments/${targetSlug}`
          : `/developments/${targetSlug}`,
      );
      return;
    }

    if (segments[0] === "services" && segments[1]) {
      const targetSlug = resolveSlugByLocale(
        segments[1],
        targetLocale,
        serviceSlugMaps,
      );
      await i18n.changeLanguage(targetLocale);
      navigate(targetLocale === "en" ? `/en/${targetSlug}` : `/${targetSlug}`);
      return;
    }

    if (
      segments.length === 1 &&
      !STATIC_ROOT_SEGMENTS.has(segments[0]) &&
      segments[0] !== "en"
    ) {
      const targetSlug = resolveSlugByLocale(
        segments[0],
        targetLocale,
        serviceSlugMaps,
      );
      await i18n.changeLanguage(targetLocale);
      navigate(targetLocale === "en" ? `/en/${targetSlug}` : `/${targetSlug}`);
      return;
    }

    await i18n.changeLanguage(targetLocale);
    navigate(toPrefixedPath(targetLocale, strippedPath));
  };

  const LangSwitcher = ({ mobile = false }) => {
    const [open, setOpen] = useState(false);

    if (mobile) {
      return (
        <div className="mt-8">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center text-[20px] font-semibold"
          >
            {/* Left Side (Flag + Language) */}
            <div className="flex items-center gap-3">
              <img
                src={routeLocale === "en" ? usFlag : deFlag}
                alt="flag"
                className="w-6 h-4 object-cover"
              />
              <span>{routeLocale === "en" ? "English" : "Deutsch"}</span>
            </div>

            {/* Right Side (+ / - icon) */}
            <span className="text-(--orange) text-3xl leading-none">
              {open ? "−" : "+"}
            </span>
          </button>

          {open && (
            <div className="mt-4 space-y-4 pl-2 text-[18px]">
              <button
                onClick={() => {
                  changeLanguage("en");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3"
              >
                <img src={usFlag} alt="US" className="w-6 h-4 object-cover" />
                English
              </button>

              <button
                onClick={() => {
                  changeLanguage("de");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3"
              >
                <img src={deFlag} alt="DE" className="w-6 h-4 object-cover" />
                Deutsch
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <button className="flex items-center gap-2 font-medium hover:text-(--orange) transition  cursor-pointer">
          <img
            src={routeLocale === "en" ? usFlag : deFlag}
            alt="flag"
            className="w-6 h-4 object-cover"
          />
          {routeLocale === "en" ? "English" : "Deutsch"}
          <span className="text-(--orange) text-sm transition-transform duration-300 group-hover:rotate-90 inline-block">
            <i className="fa-solid fa-angle-right"></i>
          </span>
        </button>

        <div className="absolute right-0 mt-3 w-44 bg-[#ffffff] rounded-xl shadow-xl py-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => changeLanguage("en")}
            className="flex items-center gap-3 px-4 py-2 w-full hover:text-(--orange) transition  cursor-pointer"
          >
            <img src={usFlag} alt="US" className="w-6 h-4 object-cover" />
            English
          </button>

          <button
            onClick={() => changeLanguage("de")}
            className="flex items-center gap-3 px-4 py-2 w-full hover:text-(--orange) transition  cursor-pointer"
          >
            <img src={deFlag} alt="DE" className="w-6 h-4 object-cover" />
            Deutsch
          </button>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full bg-white border-b border-gray-200
        shadow-sm z-50 transition-transform duration-300
        ${scroll.show ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div
        className="max-w-[1650px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between"
        ref={dropdownRef}
      >
        <Link to={buildHomePath(routeLocale)}>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-10 font-medium text-[16px] text-(--header-menu-txt-color-first)">
          <Link
            to={buildHomePath(routeLocale)}
            className="text-(--header-menu-txt-color-first) font-semibold text-[16px] hover:text-(--header-menu-dropdown-item-txt-color-hover) cursor-pointer font-title"
          >
            {t("home")}
          </Link>

          <HeaderDropdown
            label={t("services")}
            to={`${localePrefix}/services`}
          >
            {data.services.map((service) => (
              <Link
                key={service.id}
                to={`${localePrefix}/${service.slug}`}
                className="block hover:text-(--orange) transition"
              >
                {service.title}
              </Link>
            ))}
          </HeaderDropdown>

          <HeaderDropdown
            label={t("development")}
            to={`${localePrefix}/developments`}
          >
            {data.developments.map((dev) => (
              <Link
                key={dev.id}
                to={`${localePrefix}/developments/${dev.slug}`}
                className="block hover:text-(--orange) transition"
              >
                {dev.title}
              </Link>
            ))}
          </HeaderDropdown>

          <HeaderDropdown
            label={t("company")}
            to={`${localePrefix}/company`}
            width="200px"
          >
            <Link
              to={`${localePrefix}/company#about`}
              className="block hover:text-(--orange) transition"
            >
              {t("aboutUs")}
            </Link>
            <Link
              to={`${localePrefix}/company#offshoring`}
              className="block hover:text-(--orange) transition"
            >
              {t("offshoring")}
            </Link>
            <Link
              to={`${localePrefix}/company#cv`}
              className="block hover:text-(--orange) transition"
            >
              {t("cvDownload")}
            </Link>
          </HeaderDropdown>

          <LangSwitcher />
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden text-2xl font-bold"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden fixed top:72px left-0 w-full h-screen bg-white px-6 py-8 overflow-y-auto ">
          <Link
            to={buildHomePath(routeLocale)}
            onClick={() => setMobileOpen(false)}
            className="block text-[20px] font-semibold mb-8 font-title"
          >
            {t("home")}
          </Link>

          {/* Services */}
          <div className="mb-8">
            <div className="flex justify-between items-center gap-4">
              <Link
                to={`${localePrefix}/services`}
                onClick={() => setMobileOpen(false)}
                className="text-[20px] font-semibold font-title"
              >
                {t("services")}
              </Link>
              <button
                onClick={() => toggleMobileDropdown("services")}
                className="text-(--orange) text-3xl leading-none"
                aria-label="Toggle services menu"
              >
                {mobileDropdown === "services" ? "−" : "+"}
              </button>
            </div>
            {mobileDropdown === "services" && (
              <div className="mt-4 space-y-4 pl-2 text-[18px]">
                {data.services.map((service) => (
                  <Link
                    key={service.id}
                    to={`${localePrefix}/${service.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block font-desc"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Development */}
          <div className="mb-8">
            <div className="flex justify-between items-center gap-4">
              <Link
                to={`${localePrefix}/developments`}
                onClick={() => setMobileOpen(false)}
                className="text-[20px] font-semibold font-title"
              >
                {t("development")}
              </Link>
              <button
                onClick={() => toggleMobileDropdown("development")}
                className="text-(--orange) text-3xl leading-none"
                aria-label="Toggle development menu"
              >
                {mobileDropdown === "development" ? "−" : "+"}
              </button>
            </div>
            {mobileDropdown === "development" && (
              <div className="mt-4 space-y-4 pl-2 text-[18px]">
                {data.developments.map((dev) => (
                  <Link
                    key={dev.id}
                    to={`${localePrefix}/developments/${dev.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    {dev.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div className="mb-8">
            <div className="flex justify-between items-center gap-4">
              <Link
                to={`${localePrefix}/company`}
                onClick={() => setMobileOpen(false)}
                className="text-[20px] font-semibold font-title"
              >
                {t("company")}
              </Link>
              <button
                onClick={() => toggleMobileDropdown("company")}
                className="text-(--orange) text-3xl leading-none"
                aria-label="Toggle company menu"
              >
                {mobileDropdown === "company" ? "−" : "+"}
              </button>
            </div>
            {mobileDropdown === "company" && (
              <div className="mt-4 space-y-4 pl-2 text-[18px]">
                <Link
                  to={`${localePrefix}/company#about`}
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  {t("aboutUs")}
                </Link>
                <Link
                  to={`${localePrefix}/company#offshoring`}
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  {t("offshoring")}
                </Link>
                <Link
                  to={`${localePrefix}/company#cv`}
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  {t("cvDownload")}
                </Link>
              </div>
            )}
          </div>

          <LangSwitcher mobile />
        </div>
      )}

    </header>

  );
}
