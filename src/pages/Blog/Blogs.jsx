import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const getLocaleFromPath = (pathname) =>
  pathname.startsWith("/en") ? "en" : "de";

const getLocalePrefix = (locale) => (locale === "en" ? "/en" : "");

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();

  const routeLocale = getLocaleFromPath(location.pathname);
  const localePrefix = getLocalePrefix(routeLocale);

  useEffect(() => {
    fetch(`${BASE_URL}/api/blogs?populate=*&sort=order:asc&locale=${routeLocale}`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
      })
      .catch((err) => console.error(err));
  }, [routeLocale]);

  return (
    <section className="pt-20 pb-20">
      <div className="w-full max-w-[562px] lg:max-w-[1200px] mx-auto px-[15px] lg:px-0">
        <div className="flex justify-center mb-5">
          <h2 className="service-title text-[48px] font-semibold">
            <span>Blog</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6">
          {blogs.map((blog) => {
            const imageUrl = blog.image?.url
              ? `${BASE_URL}${blog.image.url}`
              : null;

            return (
              <div className="w-full max-w-[560px] mx-auto lg:max-w-none lg:mx-0 p-[15px]">
                <div
                  key={blog.documentId}
                  className="bg-white rounded-[30px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="w-full h-[350px] object-cover rounded-t-[30px]"
                    />
                  )}

                  <div className="px-[15px] py-[15px]">
                    <h2 className="text-[20px] mt-[10px] mb-[5px] leading-[1.3] font-[625] text-(--e-global-color-secondary) font-title mb-6">
                      {blog.title}
                    </h2>
                    <div className="mt-[15px]">
                      <Link
                        to={`${localePrefix}/blogs/${blog.documentId}`}
                        className="text-[16px]  font-medium text-(--e-global-color-primary) hover:underline font-desc"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Blogs;
