// src/api/getFlights.ts

export async function fetchFlightsFromAirport(iataCode: string, date: string) {
  const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iataCode}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'd8044ed75fmshff41b6fef3fb0bdp100fd5jsn8a9d5b0713ae',
      'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result; // <-- Properly return JSON
  } catch (error) {
    console.error('Flight fetch failed:', error);
    return null;
  }
}
