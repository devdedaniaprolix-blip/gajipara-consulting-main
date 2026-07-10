import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config/api";

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
    return (
      <p className="text-center py-20 text-lg">
        {t("notFound")}
      </p>
    );

  const { title, description, image, lits } = development;

  const imageUrl = image?.url
    ? `${BASE_URL}${image.url}`
    : null;

  return (
    <div className="py-16 mt-25">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="flex justify-center mb-5">
          <h2 className="service-title text-[48px] font-semibold">
            <span>{title}</span>
          </h2>
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mb-10">
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

          <div className="w-full h-[1px] bg-gray-300 mb-5"></div>

          <p className="text-(--e-global-color-text) text-lg leading-relaxed mb-5 font-desc">
            {description}
          </p>

          {lits?.length > 0 && (
            <>
              <h3 className="font-semibold text-[18px] text-(--e-global-color-secondary) mb-5 font-title">
                {t("offer")}
              </h3>

              <ul className="list-disc pl-6 text-lg space-y-1 text-(--e-global-color-text)">
                {lits.map((item) => (
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
  );
};

export default DevelopmentDetailsPage;
