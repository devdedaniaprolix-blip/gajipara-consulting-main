export const STATIC_ROOT_SEGMENTS = new Set([
  "home",
  "services",
  "developments",
  "company",
  "blogs",
]);

export const toPrefixedPath = (targetLocale, nakedPath) => {
  if (targetLocale === "en") {
    return nakedPath === "/" ? "/en/home" : `/en${nakedPath}`;
  }
  return nakedPath;
};

export const buildHomePath = (locale) => (locale === "en" ? "/en/home" : "/");
