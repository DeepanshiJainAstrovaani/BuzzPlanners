/* eslint-disable @typescript-eslint/no-unused-vars */

// src/api/getTravelPackages.ts
export async function fetchTravelPackages(destination: string, date: string) {
  // Simulate async call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        packages: [
          {
            id: 1,
            title: "Kasauli 3D/2N Trip From Delhi",
            star: 4.5,
            departure: "Delhi",
            destination: "Kasauli",
            date: "2025-07-10",
            flights: true,
            stay: true,
            meals: true,
            sightseeing: true,
            price: 5500,
            specialOffer: true,
            seatsLeft: 'few',
            images: ["/images/kasauli1.jpg", "/images/hotel1.jpg"], // use real file paths in production
            amenities: ["Sightseeing", "Flights", "Stay", "Meals"],
          },
          {
            id: 2,
            title: "Kasauli 3D/2N Trip From Delhi",
            star: 4.5,
            departure: "Delhi",
            destination: "Kasauli",
            date: "2025-07-10",
            flights: true,
            stay: true,
            meals: true,
            sightseeing: true,
            price: 12800,
            specialOffer: false,
            seatsLeft: 'few',
            images: ["/images/kasauli2.jpg", "/images/hotel2.jpg"],
            amenities: ["Sightseeing", "Flights", "Stay", "Meals"],
          },
          {
            id: 3,
            title: "Kasauli 3D/2N Trip From Delhi",
            star: 4.5,
            departure: "Delhi",
            destination: "Kasauli",
            date: "2025-07-10",
            flights: true,
            stay: true,
            meals: true,
            sightseeing: true,
            price: 16200,
            specialOffer: true,
            seatsLeft: 'few',
            images: ["/images/kasauli1.jpg", "/images/hotel1.jpg"],
            amenities: ["Sightseeing", "Flights", "Stay", "Meals"],
          },
          {
            id: 4,
            title: "Kasauli 3D/2N Trip From Delhi",
            star: 4.5,
            departure: "Delhi",
            destination: "Kasauli",
            date: "2025-07-10",
            flights: true,
            stay: true,
            meals: true,
            sightseeing: true,
            price: 25000,
            specialOffer: false,
            seatsLeft: 'few',
            images: ["/images/kasauli2.jpg", "/images/hotel2.jpg"],
            amenities: ["Sightseeing", "Flights", "Stay", "Meals"],
          },
        ]
      });
    }, 500);
  });
}
