// src/app/flight-search/page.tsx

import React from 'react';
import { fetchFlightsFromAirport } from '@/api/getFlights';

export default async function FlightSearchPage() {
  const airportCode = 'YYZ';
  const today = new Date().toISOString().split('T')[0]; // '2025-07-22'
  const flightData = await fetchFlightsFromAirport(airportCode, today);
  const departures = flightData?.departures || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Live Departures from {airportCode}</h1>

      {departures.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {departures.map((flight: any, index: number) => (
            <li
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f8f8',
              }}
            >
              <h2 style={{ margin: 0 }}>{flight.airline?.name || 'Unknown Airline'}</h2>
              <p><strong>Flight Number:</strong> {flight.number || 'N/A'}</p>
              <p><strong>Departure:</strong> {flight.departure?.airport?.name || 'N/A'} at {flight.departure?.scheduledTimeLocal || 'N/A'}</p>
              <p><strong>Arrival:</strong> {flight.arrival?.airport?.name || 'N/A'}</p>
              <p><strong>Aircraft:</strong> {flight.aircraft?.model || 'N/A'}</p>
              <p><strong>Status:</strong> {flight.status || 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
