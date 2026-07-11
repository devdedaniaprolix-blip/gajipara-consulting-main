export const buildSlugMaps = (items) => {
  const docIdBySlug = {};
  const slugsByDocId = {};

  items.forEach((item) => {
    if (!item?.documentId || !item?.slug || !item?.locale) return;

    slugsByDocId[item.documentId] = {
      ...(slugsByDocId[item.documentId] || {}),
      [item.locale]: item.slug,
    };
    docIdBySlug[item.slug] = item.documentId;

    (item.localizations || []).forEach((loc) => {
      if (!loc?.locale || !loc?.slug) return;
      slugsByDocId[item.documentId][loc.locale] = loc.slug;
      docIdBySlug[loc.slug] = item.documentId;
    });
  });

  return { docIdBySlug, slugsByDocId };
};

export const resolveSlugByLocale = (slug, targetLocale, maps) => {
  const docId = maps.docIdBySlug[slug];
  if (!docId) return slug;
  return maps.slugsByDocId[docId]?.[targetLocale] || slug;
};
