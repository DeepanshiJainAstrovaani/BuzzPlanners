// src/api/getFlights.ts

export async function fetchFlightsFromAirport(iataCode: string, date: string) {  // eslint-disable-line @typescript-eslint/no-unused-vars
  const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iataCode}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '65c3fe1f51mshf313f0d66fe7083p1fab7ajsn18157d1cb668',
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
