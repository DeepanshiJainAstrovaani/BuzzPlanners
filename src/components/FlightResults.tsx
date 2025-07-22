// src/components/FlightResults.tsx
'use client';

import React from 'react';

export default function FlightResults({ flights }: { flights: any[] }) {
  if (!flights.length) return <p>No flights found.</p>;

  return (
    <ul>
      {flights.map((flight, index) => (
        <li key={index}>
          {flight.airline_iata} - {flight.flight_number} from {flight.dep_iata} to {flight.arr_iata}
        </li>
      ))}
    </ul>
  );
}
