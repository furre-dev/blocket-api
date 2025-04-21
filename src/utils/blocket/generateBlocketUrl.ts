export const generateBlocketUrl = (base_url: string, filter: string[], searchQuery: string | null) => {
  let url = `${base_url}?${filter.join("&")}`;
  if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
  return url
}