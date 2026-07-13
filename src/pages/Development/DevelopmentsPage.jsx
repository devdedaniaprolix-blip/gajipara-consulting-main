import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DevelopmentCard from "../../components/DevelopmentCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { BASE_URL } from "../../config/api";

import "swiper/css";

import {  Pagination } from "swiper/modules";
import "swiper/css/pagination";

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

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className={`${isHome ? "pt-[86px]" : "pt-[200px]"
        } px-5 sm:px-8 lg:px-12 xl:px-0 pb-20`}
    >

      <div className="w-full max-w-[1170px] mx-auto">

        {/* Title */}
        <div className="flex justify-center pb-5">
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
          isHome ? (
            <Swiper
              className="development-swiper"
              modules={[Autoplay, Pagination]}
              spaceBetween={15}
              loop={sliderData.length > 3}
              speed={800}
              centeredSlides={isSingleCard}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: isDesktop,
                dynamicMainBullets: 2,
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
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1440: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
              }}
            >
              {sliderData.map((development) => (
                <SwiperSlide
                  key={development.id}
                  className="!flex justify-center pb-6 mt-[15px]"
                >
                  <div className="w-full max-w-[532px] lg:max-w-[380px] mx-auto px-[15px] lg:px-0">
                    <DevelopmentCard development={development} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="max-w-[1200px] mt-[25px] mx-auto flex flex-wrap px-[15px] lg:px-0">
              {developments.map((development) => (
                <div
                  key={development.id}
                  className="w-full min-[1025px]:w-1/3 px-[15px] mb-[30px] flex justify-center"
                >
                  <div className="w-full max-w-[560px] min-[1025px]:max-w-none">
                    <DevelopmentCard development={development} />
                  </div>
                </div>
              ))}
            </div>
          )
        )}



      </div>

    </div>
  );
};

export default DevelopmentsPage;
