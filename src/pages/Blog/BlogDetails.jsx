import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../assets/img_offshoring.jpg";
import { BASE_URL } from "../../config/api";

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";

const getLocalePrefix = (locale) => (locale === "en" ? "/en" : "");

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeLocale = getLocaleFromPath(location.pathname);
  const localePrefix = getLocalePrefix(routeLocale);

  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // fetch current blog with locale
    fetch(`${BASE_URL}/api/blogs/${id}?populate=*&locale=${routeLocale}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data.data);
        window.scrollTo(0, 0);
      })
      .catch((err) => console.error(err));

    // fetch blog list for previous / next
    fetch(
      `${BASE_URL}/api/blogs?populate=*&sort=order:asc&locale=${routeLocale}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data);
      })
      .catch((err) => console.error(err));
  }, [id, routeLocale]);

  if (!blog) return <div className="text-center py-20">Loading...</div>;

  const imageUrl = blog.image?.url ? `${BASE_URL}${blog.image.url}` : null;

  const currentIndex = blogs.findIndex(
    (item) => item.documentId === blog.documentId,
  );

  const previousBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;

  const nextBlog =
    currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  return (
    <>
      {/* HERO */}
      <section
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center px-4 py-16 text-white sm:min-h-[460px] md:min-h-[500px] md:py-0"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <div className="inline-block max-w-full text-center">
            <h1 className="font-title text-5xl leading-tight font-extrabold text-balance lg:text-6xl">
              {blog.title}
            </h1>

            <div className="h-2 bg-(--orange) mt-2 w-full"></div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base font-medium font-title">
            <span className="text-(--orange)">Gajipara Consulting</span>

            {!blog.categorized && (
              <>
                <span className="text-gray-300">›</span>
                <span className="text-(--orange)">Uncategorized</span>
              </>
            )}

            <span className="text-gray-300">›</span>
            <span className="text-white">{blog.title}</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="min-h-screen py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* BLOG IMAGE */}
          {imageUrl && (
            <div className="mb-10 flex justify-center">
              <img
                src={imageUrl}
                alt={blog.title}
                className="h-auto w-full max-w-[1000px] rounded-2xl object-cover shadow-lg md:h-[667px]"
              />
            </div>
          )}

          <div className="rounded-[28px] bg-[#f3f4f6] p-6 sm:p-8 md:p-12 lg:p-16">
            {/* CATEGORY */}
            {!blog.categorized && (
              <p className="text-(--orange) text-sm font-semibold tracking-widest uppercase mb-6">
                Uncategorized
              </p>
            )}

            {/* META INFO */}
            <div className="mb-10 flex flex-col gap-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-8 font-title">
              <div className="flex items-center gap-2">
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

                <span className="text-[#3c3c3c]">By gsupperadmin</span>
              </div>

              <div className="flex items-center gap-2 text-[#3c3c3c]">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <span className="text-[#3c3c3c]">{blog.publishedDate}</span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-300 mb-10" />

            {/* DESCRIPTION */}
            <p className="mb-16 max-w-[820px] text-[17px] leading-8 text-(--global-txt-color) font-desc">
              {blog.description}
            </p>

            {/* NEXT / PREVIOUS */}
            <div className="flex flex-col gap-6 font-desc sm:flex-row sm:items-center sm:justify-between">
              {previousBlog ? (
                <div
                  onClick={() =>
                    navigate(`${localePrefix}/blogs/${previousBlog.documentId}`)
                  }
                  className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:text-orange-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>

                  <span className="text-[#3c3c3c] hover:text-(--orange)">PREVIOUS POST</span>
                </div>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              {nextBlog && (
                <div
                  onClick={() =>
                    navigate(`${localePrefix}/blogs/${nextBlog.documentId}`)
                  }
                  className="flex items-center gap-2 text-[#3c3c3c] font-semibold cursor-pointer hover:text-(--orange) transition"
                >
                  <span>NEXT POST</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
