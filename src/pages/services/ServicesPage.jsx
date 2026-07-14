import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config/api";

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";
  const localePrefix = routeLocale === "en" ? "/en" : "";

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${BASE_URL}/api/services?populate=*&sort=order:asc&locale=${routeLocale}`
        );

        if (res.status === 403 || res.status === 400) {
          navigate(`${localePrefix}/404`, { replace: true });
          return;
        }

        const data = await res.json();
        setServices(data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    if (i18n.language.split("-")[0] !== routeLocale) {
      i18n.changeLanguage(routeLocale);
    }

    fetchServices();
  }, [i18n, routeLocale]);

  return (
    <div className="pt-[150px] font-title pb-20">
      <div className="w-full max-w-[562px] lg:max-w-[1200px] mx-auto ">
        <div className="flex p-[10px] justify-center mb-6">
          <h2 className="service-title text-[40px] lg:text-[48px] font-semibold">
            <span>{t("services")}</span>
          </h2>
        </div>

        {loading && <p className="text-center text-lg">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-wrap px-[15px] lg:px-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="w-full min-[1025px]:w-1/3 px-[15px] mb-[30px] flex justify-center"
              >
                <div className="w-full max-w-[560px] min-[1025px]:max-w-none">
                  <ServiceCard service={service} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
