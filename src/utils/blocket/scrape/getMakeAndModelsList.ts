import { ElementHandle, Page } from "puppeteer";
import { elementNotFound } from "../../errorMessages";
import { delay } from "../../delay";

export const getMakeAndModelsList = async (car: ElementHandle<HTMLLIElement>, page: Page) => {
  const brandExpandModelsButton = await car.$("div > button:nth-child(2)");

  if (!brandExpandModelsButton) {
    return null;
  }

  await brandExpandModelsButton.click();
  await delay(500);

  await car.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
  await delay(500);

  // Now the models should be visible

  const brandDiv = await car.waitForSelector("div > button > div:nth-child(2) > div > div");
  const brandText = await page.evaluate((element) => {
    const brand = element?.firstChild?.textContent?.trim();
    if (!brand) return null;
    return brand;
  }, brandDiv);

  const modelsList = await car.$$("ul > li");

  const modelsArray = await Promise.all(
    modelsList.map(async (model_item) => {
      const modelDiv = await model_item.waitForSelector(`div > button > div:nth-child(2) > div > div`);
      const modelText = await page.evaluate((element) => {
        // Get the first part of the text (Audi) by accessing the first child node
        const brand = element?.firstChild?.textContent?.trim();
        if (!brand) return null;
        return brand;
      }, modelDiv);
      return modelText
    })
  )

  const models = modelsArray.filter((item) => item !== null);

  return {
    make_brand: brandText,
    make_models: models
  }
}