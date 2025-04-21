export type BlocketAPIResponse = {
  cars: CarListing[] | null
}

export type CarListing = {
  dealId: string;
  link: string;
  listTime: string; // ISO date string
  originalListTime: string; // ISO date string
  seller: {
    type: string;
    name: string;
    id: string;
  };
  heading: string;
  price: {
    amount: string;
    billingPeriod: string;
  };
  thumbnail: string;
  car: {
    images: {
      height: number;
      width: number;
      image: string;
    }[];
    location: {
      region: string;
      municipality: string;
      area: string;
    };
    fuel: string;
    gearbox: string;
    regDate: number;
    mileage: number;
    equipment: {
      label: string;
    }[];
  };
  dcb: boolean;
  description: string;
};

export type ExampleListing = {
  preview_data: string;
  thumbnail_image: string;
  link: string;
  heading: string;
  price: string;
}
