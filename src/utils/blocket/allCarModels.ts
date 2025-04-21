const file = require("../../../makes_models.json");

// Your input data (example)
const allCarBrandsAndModels: { make_brand: string, make_models: string[] }[] = file;

export const allBrands = allCarBrandsAndModels.map((entry) => entry.make_brand) as [string, ...string[]];

export const getAllModelsForCurrentBrand = (brands: string[]) => {
  const allModels = brands.flatMap((brand) => {
    const currentCar = allCarBrandsAndModels.find((car) => car.make_brand === brand);
    if (!currentCar) return null;
    return currentCar.make_models
  }).filter((brand) => brand !== null)

  return allModels
}
