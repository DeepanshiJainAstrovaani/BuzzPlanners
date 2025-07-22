export type Place = {
  entityId: string;
  iataCode: string;
  name: string;
  countryName: string;
  cityName?: string;
};


export interface FlightData {
  airline: { name: string };
  flight: { iata: string; number: string };
  departure: { airport: string; scheduled: string };
  arrival: { airport: string; scheduled: string };
  flight_status: string;
}

export interface AeroFlight {
  flightIata: string;
  airlineName: string;
  departure: { iata: string; scheduledTime: string };
  arrival: { iata: string; scheduledTime: string };
}
