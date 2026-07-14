import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config/api";
import NotFound from "../NotFound";

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";
  const localePrefix = routeLocale === "en" ? "/en" : "";

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${BASE_URL}/api/services?filters[slug][$eq]=${encodeURIComponent(
            slug,
          )}&populate=*&locale=${routeLocale}`,
        );

        if (res.status === 403 || res.status === 400) {
          navigate(`${localePrefix}/404`, { replace: true });
          return;
        }

        const data = await res.json();
        setService(data?.data?.[0] || null);
      } catch (error) {
        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (i18n.language.split("-")[0] !== routeLocale) {
      i18n.changeLanguage(routeLocale);
    }

    window.scrollTo(0, 0);
    fetchService();
  }, [slug, routeLocale, i18n]);

  if (loading) {
    return (
      <p className="text-center py-20 text-lg font-semibold">Loading...</p>
    );
  }

  if (!service) {
    return <NotFound />;
  }

  const { title, description, image, offers, PageTitle, offerTitle } = service;
  const imageUrl = image?.url ? `${BASE_URL}${image.url}` : null;
  const pageHeading = PageTitle || title;

  return (
    <div className="mt-20 pb-20 py-12 sm:mt-22 sm:py-14 lg:mt-25 lg:py-16">
      <div className="mx-auto w-full max-w-[562px] px-[15px] lg:max-w-[1200px] lg:px-8">

        <div className="flex justify-center mb-10">
          <h2 className="service-title text-[40px] lg:text-[48px] font-semibold text-center">
            <span>{pageHeading}</span>
          </h2>
        </div>

        <div className="mx-auto max-w-[560px] lg:max-w-none">
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt={title}
                className="h-[200px] w-full rounded-[28px] object-cover sm:h-[250px] md:h-[250px] lg:h-[500px] lg:rounded-3xl lg:shadow-md"
              />
            </div>
          )}

          <div className="bg-[#F6FCFF] rounded-[32px] p-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] max-w-[1200px]">
            <div className="m-[10px]">
              <h2 className="mb-6 text-[20px] font-bold text-(--e-global-color-secondary) font-title">
                {title}
              </h2>

              <div className="mb-6 w-full border-t border-[#D6D6D6] lg:mb-6"></div>

              <p className="mb-6 text-[15px] leading-8 text-(--e-global-color-text) font-desc sm:text-base lg:text-lg">
                {description}
              </p>

              {offers?.length > 0 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-(--e-global-color-secondary) font-title">
                    {offerTitle}
                  </h3>

                  <div className="inline-block">
                    <ul className="space-y-3">
                      {offers.map((item) => (
                        <li key={item.id} className="flex items-start gap-3">
                          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gray-700 shrink-0"></span>
                          <span className="font-desc text-[15px] sm:text-base lg:text-lg leading-7">
                            {item.lists}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
