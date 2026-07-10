import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import AboutPage from "./AboutPage";
import OffshoringModel from "../components/OffshoringModel";
import CvDownload from "../components/CvDownload";

export default function Company() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); 
      }
    }
  }, [location]);

  return (
    <>
      <div id="about">
        <AboutPage />
      </div>

      <div id="cv">
        <CvDownload />
      </div>

      <div id="offshoring">
        <OffshoringModel />
      </div>
    </>
  );
}