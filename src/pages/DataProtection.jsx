import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config/api";

const DataProtection = () => {
    const location = useLocation();

    const [sections, setSections] = useState([]);
    const [pageTitle, setPageTitle] = useState("");

    // Detect locale from URL
    const routeLocale = location.pathname.startsWith("/en") ? "en" : "de";

    useEffect(() => {
        fetchDataProtection();
    }, [routeLocale]);

    const fetchDataProtection = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/data-protections?populate=*&locale=${routeLocale}`
            );

            const data = res.data.data[0];

            setPageTitle(data?.pageTitle || "");
            setSections(data?.dataSection || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Extract only the body content
    const extractBody = (html) => {
        if (!html) return "";

        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

        return match ? match[1] : html;
    };

    return (
        <section className="mx-auto w-full max-w-[562px] px-[15px] pt-[150px] pb-[80px] lg:max-w-[1200px]">
            {/* Page Title */}
            <div className="flex p-[10px] justify-center mb-5">
                <h2 className="service-title text-[48px] font-semibold">
                    <span>{pageTitle}</span>
                </h2>
            </div>

            {sections.map((item) => {
                const html =
                    item.description?.[0]?.children?.find(
                        (child) => child.type === "text"
                    )?.text || "";

                return (
                    <div
                        key={item.id}
                        className="bg-[#FAFAFA] rounded-[30px] p-[15px] mb-[30px]"
                    >
                        {item.title && (
                            <>
                                <div className="mt-0 mb-5 text-[25px] font-bold text-[#DE7731] font-title">
                                    {item.title}
                                </div>

                                <div className="h-px w-full bg-gray-300"></div>
                            </>
                        )}
                        <div
                            className="address-content text-[#4B4B4B]"
                            dangerouslySetInnerHTML={{
                                __html: extractBody(html),
                            }}
                        />
                    </div>
                );
            })}
        </section>
    );
};

export default DataProtection;
