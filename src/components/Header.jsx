import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../config/api";
import { buildSlugMaps, resolveSlugByLocale } from "../utils/slugHelper";
import {
  STATIC_ROOT_SEGMENTS,
  toPrefixedPath,
  buildHomePath,
} from "../utils/language";
import HeaderDropdown from "./HeaderDropdown";
import MobileDropdown from "./MobileDropdown";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const [services, setServices] = useState([]);
  const [developments, setDevelopments] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScroll = useRef(0);
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.scrollY > 50;
    }
    return false;
  });
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";
  const localePrefix = routeLocale === "en" ? "/en" : "";

  const serviceSlugMaps = buildSlugMaps(services);
  const developmentSlugMaps = buildSlugMaps(developments);

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
        setServices(servicesData.data || []);
        setDevelopments(devData.data || []);
      } catch (err) {
        console.error("Header fetch error:", err);
      }
    };
    fetchData();
  }, [routeLocale]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 50);
      setShowHeader(!(current > lastScroll.current && current > 80));
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const toggleMobileDropdown = (key) =>
    setMobileDropdown((prev) => (prev === key ? null : key));

  const changeLanguage = async (targetLocale) => {
    const currentLocale = location.pathname.startsWith("/en") ? "en" : "de";
    if (targetLocale === currentLocale) return;

    const strippedPath = location.pathname.startsWith("/en")
      ? location.pathname.replace(/^\/en/, "") || "/"
      : location.pathname;

    const segments = strippedPath.split("/").filter(Boolean);

    await i18n.changeLanguage(targetLocale);

    const goToHome = () => {
      navigate(buildHomePath(targetLocale));
    };

    const goToDevelopment = (slug) => {
      const targetSlug = resolveSlugByLocale(
        slug,
        targetLocale,
        developmentSlugMaps,
      );
      navigate(
        targetLocale === "en"
          ? `/en/developments/${targetSlug}`
          : `/developments/${targetSlug}`,
      );
    };

    const goToService = (slug) => {
      const targetSlug = resolveSlugByLocale(slug, targetLocale, serviceSlugMaps);
      navigate(targetLocale === "en" ? `/en/${targetSlug}` : `/${targetSlug}`);
    };

    if (segments.length === 0 || segments[0] === "home") {
      return goToHome();
    }

    if (segments[0] === "developments" && segments[1]) {
      return goToDevelopment(segments[1]);
    }

    if (segments[0] === "services" && segments[1]) {
      return goToService(segments[1]);
    }

    if (
      segments.length === 1 &&
      !STATIC_ROOT_SEGMENTS.has(segments[0]) &&
      segments[0] !== "en"
    ) {
      return goToService(segments[0]);
    }

    navigate(toPrefixedPath(targetLocale, strippedPath));
  };

  const companyLinks = [
    {
      label: t("aboutUs"),
      path: "#about",
    },
    {
      label: t("offshoring"),
      path: "#offshoring",
    },
    {
      label: t("cvDownload"),
      path: "#cv",
    },
  ];

  const serviceItems = services.map((service) => ({
    to: `${localePrefix}/${service.slug}`,
    label: service.title,
    className: "font-desc",
  }));

  const devItems = developments.map((dev) => ({
    to: `${localePrefix}/developments/${dev.slug}`,
    label: dev.title,
  }));

  const companyItems = companyLinks.map((link) => ({
    to: `${localePrefix}/company${link.path}`,
    label: link.label,
  }));

  const [is404, setIs404] = useState(false);

  useEffect(() => {
    const handleCheck = () => {
      setIs404(document.body.classList.contains("is-404-page"));
    };
    handleCheck();
    const timer = setTimeout(handleCheck, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isBlogDetailsPage = /^\/(en\/)?blogs\/[^/]+$/.test(location.pathname);
  const isauthorPage = /^\/(en\/)?author\/[^/]+$/.test(location.pathname);
  const isDarkHeader = isBlogDetailsPage || is404 || isauthorPage;

  // Background and border classes
  let bgClass = "";
  let borderClass = "";
  let shadowClass = "";

  if (isDarkHeader) {
    // Mobile is solid black with shadow. Desktop is transparent when scrollY <= 50, solid black when scrollY > 50.
    bgClass = isScrolled ? "bg-[#000000]" : "bg-[#000000] xl:bg-transparent";
    borderClass = "border-none";
    shadowClass = isScrolled ? "shadow-md" : "shadow-md xl:shadow-none";
  } else {
    // Mobile is solid white with shadow/border. Desktop is transparent when scrollY <= 50, solid white when scrollY > 50.
    bgClass = isScrolled ? "bg-white" : "bg-white xl:bg-transparent";
    borderClass = isScrolled ? "border-b border-gray-200" : "border-b border-gray-200 xl:border-b-0";
    shadowClass = "shadow-[1px_1px_14px_#00000017]";
  }

  const textClass = isDarkHeader ? "text-white" : "text-(--header-menu-txt-color-first)";
  const mobileMenuBgClass = isDarkHeader ? "bg-[#000000] text-white" : "bg-white text-black";

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
        ${bgClass} ${borderClass} ${shadowClass}
      `}
    >
      <div
        className="max-w-[1650px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-[27px]"
        ref={dropdownRef}
      >
        <Link to={buildHomePath(routeLocale)}>
          <img src={logo} alt="Logo" className="w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden xl:flex items-center gap-10 font-medium text-[16px] ${textClass}`}>
          <Link
            to={buildHomePath(routeLocale)}
            className={`font-semibold text-[16px] hover:text-(--header-menu-dropdown-item-txt-color-hover) cursor-pointer font-title transition-colors duration-300 ${textClass}`}
          >
            {t("home")}
          </Link>

          <HeaderDropdown
            label={t("services")}
            to={`${localePrefix}/services`}
            textColorClass={textClass}
          >
            {services.map((service) => (
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
            textColorClass={textClass}
          >
            {developments.map((dev) => (
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
            textColorClass={textClass}
          >
            {companyLinks.map((link) => (
              <Link
                key={link.path}
                to={`${localePrefix}/company${link.path}`}
                className="block hover:text-(--orange) transition"
              >
                {link.label}
              </Link>
            ))}
          </HeaderDropdown>

          <LangSwitcher
            routeLocale={routeLocale}
            changeLanguage={changeLanguage}
            setMobileOpen={setMobileOpen}
          />
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`xl:hidden text-2xl font-bold transition-colors duration-300 ${textClass}`}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`xl:hidden fixed top-[86px] left-0 w-full h-screen px-6 py-8 overflow-y-auto transition-all duration-300 ${mobileMenuBgClass}`}>
          <Link
            to={buildHomePath(routeLocale)}
            onClick={() => setMobileOpen(false)}
            className="block text-[20px] font-semibold mb-8 font-title"
          >
            {t("home")}
          </Link>

          <MobileDropdown
            title={t("services")}
            to={`${localePrefix}/services`}
            items={serviceItems}
            isOpen={mobileDropdown === "services"}
            onToggle={() => toggleMobileDropdown("services")}
            setMobileOpen={setMobileOpen}
          />

          <MobileDropdown
            title={t("development")}
            to={`${localePrefix}/developments`}
            items={devItems}
            isOpen={mobileDropdown === "development"}
            onToggle={() => toggleMobileDropdown("development")}
            setMobileOpen={setMobileOpen}
          />

          <MobileDropdown
            title={t("company")}
            to={`${localePrefix}/company`}
            items={companyItems}
            isOpen={mobileDropdown === "company"}
            onToggle={() => toggleMobileDropdown("company")}
            setMobileOpen={setMobileOpen}
          />

          <LangSwitcher
            routeLocale={routeLocale}
            changeLanguage={changeLanguage}
            setMobileOpen={setMobileOpen}
            mobile
          />
        </div>
      )}
    </header>
  );
}
