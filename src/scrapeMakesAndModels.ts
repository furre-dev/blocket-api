import puppeteer from 'puppeteer';
import { elementNotFound } from './utils/errorMessages';
import { getMakeAndModelsList } from './utils/blocket/scrape/getMakeAndModelsList';
import { delay } from './utils/delay';
import { writeFile } from 'fs';

const URL = "https://www.blocket.se/bilar/sok";

const scrapeMakesAndModels = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(URL, { waitUntil: "networkidle2" });

  const cookiesIframe = await page.waitForSelector('iframe#sp_message_iframe_1253915', {
    visible: true,  // Ensure the button is visible
  });

  if (!cookiesIframe) {
    throw new Error(elementNotFound("cookiesIframe"))
  }

  const frame = await cookiesIframe.contentFrame();

  const acceptCookiesButton = await frame.waitForSelector(`button[title="Godkänn alla"]`);
  if (!acceptCookiesButton) {
    throw new Error(elementNotFound("acceptCookiesButton"))
  }

  await acceptCookiesButton?.click();

  const filterButtons = await page.$$(`button[data-cy="filter-button"]`);

  if (filterButtons.length < 1) {
    throw new Error(elementNotFound("filterButtons"))
  }

  const modelAndMakeFilterButton = filterButtons[1];

  if (!modelAndMakeFilterButton) {
    throw new Error(elementNotFound("modelAndMakeFilterButton"))
  }

  await modelAndMakeFilterButton.click();

  // at this stage we should have the "model and make" popup active
  const viewAllBrandsButton = await page.waitForSelector(`div.flex-1.max-h-\\[100vh\\].overflow-y-scroll.z-10 > div:nth-child(2) > button`)

  if (!viewAllBrandsButton) throw new Error(elementNotFound("viewAllBrandsButton"))

  await viewAllBrandsButton.click();
  await viewAllBrandsButton.evaluate((item) => console.log(item.innerHTML))
  delay(2000);

  page.screenshot({
    path: "waza.png"
  })

  const carsList: {
    make_brand: string | null;
    make_models: string[];
  }[] = [];

  const carBrandListItems = await page.$$(`div.flex-1.max-h-\\[100vh\\].overflow-y-scroll.z-10 > div:nth-child(2) > ul > li`);

  for (const brandListItem of carBrandListItems) {
    const car_info = await getMakeAndModelsList(brandListItem, page);
    if (car_info) {
      carsList.push(car_info)
      console.log(car_info.make_brand, "done")
    }
    await delay(1000); // wait for 2 seconds before next iteration
  }

  const jsonData = JSON.stringify(carsList, null, 2);

  // create a makes_models.json file to save the car data.
  writeFile("makes_models.json", jsonData, "utf-8", (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Data written to file');
    }
  })
}

scrapeMakesAndModels()
