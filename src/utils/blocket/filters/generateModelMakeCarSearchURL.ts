import { MakeAndModelInput } from "../makeAndModelTypes";

const BASE_URL = process.env.BLOCKET_API_URL;

export function generateModelMakeCarSearchURL(make_and_model: MakeAndModelInput, page: number) {
  const { make, model } = make_and_model

  let filters = [];

  if (make) {
    filters.push(`filter=${encodeURIComponent(JSON.stringify({ key: "make", values: [make] }))}`);
  }

  if (model) {
    filters.push(`filter=${encodeURIComponent(JSON.stringify({ key: "models", values: [model] }))}`);
  }

  const finalUrl = `${BASE_URL}?${filters.join("&")}&page=${page}`;
  return finalUrl;
}