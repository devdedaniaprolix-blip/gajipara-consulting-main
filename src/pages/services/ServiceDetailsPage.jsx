import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config/api";

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";

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
    return <p className="text-center py-20 text-lg font-semibold">Not found</p>;
  }

  const { title, description, image, offers, PageTitle } = service;
  const imageUrl = image?.url ? `${BASE_URL}${image.url}` : null;
  const pageHeading = PageTitle || title;

  return (
    <div className="mt-20 py-12 sm:mt-22 sm:py-14 lg:mt-25 lg:py-16">
      <div className="mx-auto w-full max-w-[562px] px-[15px] lg:max-w-[1200px] lg:px-8">


        <div className="flex justify-center mb-5">
          <h2 className="service-title text-[48px] font-semibold text-center">
            <span>{pageHeading}</span>
          </h2>
        </div>

        <div className="mx-auto max-w-[560px] lg:max-w-none">
          {imageUrl && (
            <div className="mb-4 sm:mb-5 lg:mb-10">
              <img
                src={imageUrl}
                alt={title}
                className="h-[200px] w-full rounded-[28px] object-cover sm:h-[250px] md:h-[320px] lg:h-[500px] lg:rounded-3xl lg:shadow-md"
              />
            </div>
          )}

          <div className="bg-[#F6FCFF] rounded-[32px] p-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] max-w-[1200px]">
            <div className="m-[10px]">
              <h2 className="mb-6 text-[20px] font-bold text-(--e-global-color-secondary) font-title">
                {title}
              </h2>

              <div className="mb-6 h-px w-full bg-gray-300 lg:mb-6"></div>

              <p className="mb-6 text-[15px] leading-8 text-(--e-global-color-text) font-desc sm:text-base lg:text-lg">
                {description}
              </p>

              {offers?.length > 0 && (
                <>
                  <h3 className="mb-6 text-lg font-bold text-(--e-global-color-secondary) font-title">
                    {t("offer")}
                  </h3>

                  <ul className="space-y-3 pl-5 text-[15px] leading-7 text-(--e-global-color-text) marker:text-(--e-global-color-text) sm:text-base lg:text-lg">
                    {offers.map((item) => (
                      <li key={item.id} className="font-desc">
                        {item.lists}
                      </li>
                    ))}
                  </ul>
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
