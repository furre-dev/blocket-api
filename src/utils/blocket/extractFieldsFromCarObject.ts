import { CarListing, ExampleListing } from "../types"

export const extractFieldsFromCarObject = (firstCar: CarListing) => {
  const car = firstCar.car;

  const excractFieldsFromCar: ExampleListing = {
    preview_data: `${car.regDate} / ${car.mileage} mil / ${car.gearbox}`,
    thumbnail_image: `${firstCar.thumbnail}?type=images_477x327`,
    link: firstCar.link,
    heading: firstCar.heading,
    price: firstCar.price.amount
  }

  return excractFieldsFromCar
}