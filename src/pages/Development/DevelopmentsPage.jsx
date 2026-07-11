import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DevelopmentCard from "../../components/DevelopmentCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { BASE_URL } from "../../config/api";

import "swiper/css";

const DevelopmentsPage = ({ isHome = false }) => {
  const { t, i18n } = useTranslation();

  const [developments, setDevelopments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevelopments = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/developments?populate=*&sort=order:asc&locale=${i18n.language}`
        );

        const data = await res.json();
        setDevelopments(data.data || []);
      } catch (err) {
        setError(t("errorFetchingDevelopments"));
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopments();
  }, [i18n.language, t]);

  const sliderData = useMemo(() => {
    if (developments.length >= 3) return developments;
    return [...developments, ...developments, ...developments];
  }, [developments]);
  const isSingleCard = developments.length === 1;
  return (
    <div
      className={`${isHome ? "pt-[86px]" : "pt-[200px]"
        } px-5 sm:px-8 lg:px-12 xl:px-0`}
    >

      <div className="w-full max-w-[1200px] mx-auto">

        {/* Title */}
        <div className="flex justify-center mb-7">
          <h2 className="service-title text-[48px] font-semibold">
            <span>{t("development")}</span>
          </h2>
        </div>

        {loading && (
          <p className="text-center text-base md:text-lg">
            {t("loading")}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {!loading && !error && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={15}
            loop={sliderData.length > 3}
            speed={800}
            centeredSlides={isSingleCard}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
              },

              590: {
                slidesPerView: 1,
                spaceBetween: 15,
              },

              1200: {
                slidesPerView: 3,
                spaceBetween: 15,
              },

              1440: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
            }}
            className="w-full flex h-auto"
          >
            {sliderData.map((development) => (
              <SwiperSlide
                key={development.id}
                className="!flex justify-center pb-6 mt-[15px]"
              >
                <div className="w-full max-w-[380px] mx-auto">
                  <DevelopmentCard development={development} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

    </div>
  );
};

export default DevelopmentsPage;
