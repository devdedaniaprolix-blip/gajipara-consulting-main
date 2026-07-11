import img1 from "../../public/logo/hero-image-png.png";
import ServicesPage from "./services/ServicesPage";
import DevelopmentsPage from "./Development/DevelopmentsPage";
import AboutPage from "./AboutPage";
import OffshoringModel from "../components/OffshoringModel";
import CvDownload from "../components/CvDownload";
import Blogs from "./Blog/Blogs";
import { useTranslation } from "react-i18next";
import "../App.css";
export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <section className="flex font-title bg-[#F6FCFF] justify-center items-center pb-[50px]">
        <div className="w-full max-w-[1200px] mx-auto pt-24 sm:pt-28 lg:pt-[120px] px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto flex flex-col lg:flex-row items-center justify-between max-w-[1200px]">
            {/* LEFT CONTENT */}
            <div className="w-full max-w-[570px] p-[15px] pt-[16px]">
              <p className="text-[32px] sm:text-[50px] md:text-[64px] lg:text-[76px] leading-[1.1] font-medium text-(--e-global-color-secondary) mb-[16px]">
                {t("heroTitle1")}
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-hands-holding text-[20px] sm:text-[24px] text-(--orange) shrink-0 mt-1"></i>
                  <p className="font-desc text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal text-(--e-global-color-text)">
                    {t("heroPoint1")}
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-shield-halved text-[20px] sm:text-[24px] text-(--orange) shrink-0 mt-1"></i>
                  <p className="font-desc text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal text-(--e-global-color-text)">
                    Punctuality and Reliability stays in foreground
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-user-group text-[20px] sm:text-[24px] text-(--orange) shrink-0 mt-1"></i>
                  <p className="font-desc text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal text-(--e-global-color-text)">
                    Bridging customer fulfillment and IT Landscape
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full pt-[16px] flex justify-center lg:w-[52.5%] lg:justify-end">
              <img
                src={img1}
                alt="Hero"
                className="w-full max-w-full sm:max-w-[560px] lg:max-w-xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="mt-[-69px]">
        <ServicesPage />
      </div>
      <div className="bg-[#F6FCFF] mt-[69px] pb-[80px] rounded-tr-[300px]">
        <DevelopmentsPage isHome={true} />
      </div>
      <div className="">
        <AboutPage />
      </div>

      <OffshoringModel />
      <CvDownload />
      <Blogs />
    </>
  );
}
