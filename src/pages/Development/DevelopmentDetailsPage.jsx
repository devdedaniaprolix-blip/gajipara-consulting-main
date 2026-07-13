import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config/api";
import NotFound from "../NotFound";

const DevelopmentDetailsPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [development, setDevelopment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDevelopment = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${BASE_URL}/api/developments?filters[slug][$eq]=${slug}&populate=*&locale=${i18n.language}`
        );

        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setDevelopment(data.data[0]);
        } else {
          setDevelopment(null);
        }
      } catch (err) {
        setError(t("errorFetchingDevelopment"));
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopment();
  }, [slug, i18n.language, t]);

  if (loading)
    return (
      <p className="text-center py-20 text-lg">
        {t("loading")}
      </p>
    );

  if (error)
    return (
      <p className="text-center py-20 text-red-500">
        {error}
      </p>
    );

  if (!development)
    return <NotFound />;

  const { title, description, image, lits, offerTitle } = development;

  const imageUrl = image?.url
    ? `${BASE_URL}${image.url}`
    : null;

  return (
    <div className="py-16 mt-25">
      <div className="mx-auto w-full max-w-[562px] px-[15px] lg:max-w-[1200px] lg:px-8">

        {/* Title */}
        <div className="flex justify-center mb-10">
          <h2 className="service-title text-[48px] font-semibold">
            <span>{title}</span>
          </h2>
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mb-6">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[500px] object-cover rounded-3xl shadow-md"
            />
          </div>
        )}

        {/* Content */}
        <div className="container bg-[#F6FCFF] rounded-[32px] p-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] max-w-[1200px]">
          <div className="m-[10px]">
            <h2 className="text-[22px] font-bold text-(--e-global-color-secondary) mb-5 font-title">
              {title}
            </h2>

            <div className="mb-6 w-full border-t border-[#D6D6D6] lg:mb-6"></div>

            <p className="text-(--e-global-color-text) text-lg leading-relaxed mb-5 font-desc">
              {description}
            </p>

            {lits?.length > 0 && (
              <>
                <h3 className="font-semibold text-[18px] text-(--e-global-color-secondary) mb-5 font-title">
                  {offerTitle}
                </h3>

                <div className="inline-block">
                  <ul className="space-y-3">
                    {lits.map((item) => (
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
  );
};

export default DevelopmentDetailsPage;
