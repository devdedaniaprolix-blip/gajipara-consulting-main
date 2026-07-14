import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import img1 from "../../assets/img_offshoring.jpg";
import { BASE_URL } from "../../config/api";
import { useTranslation } from "react-i18next";

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";

const getLocalePrefix = (locale) => (locale === "en" ? "/en" : "");

const getExcerpt = (text, maxLength = 320) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > 0) {
    return trimmed.substring(0, lastSpace) + " [...]";
  }
  return trimmed + " [...]";
};

const AuthorBlogs = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const routeLocale = getLocaleFromPath(location.pathname);
  const localePrefix = getLocalePrefix(routeLocale);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format username nicely: e.g. gajipara-admin -> Gajipara Consulting
  const authorName =
    username === "gajipara-admin"
      ? "Gajipara Consulting"
      : username
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/blogs?populate=*&sort=order:asc&locale=${routeLocale}`)
      .then((res) => {
        if (res.status === 403 || res.status === 400) {
          navigate(`${localePrefix}/404`, { replace: true });
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setBlogs(data.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [routeLocale, navigate, localePrefix]);

  if (loading) {
    return <div className="text-center py-20 font-title text-lg">Loading...</div>;
  }

  return (
    <>
      {/* HERO */}
      <section
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center mb-[50px] py-16 text-white sm:min-h-115 md:min-h-125 md:py-0"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 mx-auto w-full text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-block max-w-full text-center">
            <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight font-bold text-balance">
              {t("authorTitle", "Author:")} {authorName}
            </h1>

            <div className="h-1 sm:h-2 bg-(--orange) mt-2 w-full"></div>
          </div>

          <div className="mt-6 flex flex-wrap items-center text-[16px] justify-center gap-x-2 gap-y-1 text-base font-medium font-title">
            <Link
              to={`${localePrefix}/`}
              className="text-(--orange) hover:underline transition"
            >
              Gajipara Consulting
            </Link>

            <span className="text-gray-300">›</span>
            <span className="text-white">
              {t("articlesBy", "Articles by:")} {authorName}
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="w-full pb-20">
        <div className="mx-auto max-w-[1198px]">
          <div className="mx-auto">
            {blogs.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-desc">
                No articles found.
              </div>
            ) : (
              blogs.map((blog, idx) => {
                const excerpt = getExcerpt(blog.description);

                return (
                  <div key={blog.documentId || idx} className="mb-[30px]">
                    <h2 className="text-[26px] mb-[15px] font-semibold text-(--global-txt-color) hover:text-(--orange) font-title leading-tight transition-colors duration-300">
                      <Link to={`${localePrefix}/blogs/${blog.documentId}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-[8px] font-title">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-(--orange)"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A9 9 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[#3c3c3c] cursor-pointer">
                        <span className="hover:text-(--orange) transition-colors font-medium">By {authorName}</span>
                      </span>
                    </div>

                    <p className="text-[16px] mb-[16px] sm:text-[16px] text-(--global-txt-color) font-desc">
                      {excerpt}
                    </p>

                    {idx < blogs.length - 1 && (
                      <hr className="border-0 border-t border-[#D6D6D6] mt-[24px]" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthorBlogs;
