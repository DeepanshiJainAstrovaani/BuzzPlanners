import React from 'react';

export default function FlightCard({ flight }: { flight: any }) {
  const departureTime = flight?.departure?.scheduledTimeLocal?.split('T')[1]?.slice(0, 5) || 'N/A';
  const arrivalTime = flight?.arrival?.scheduledTimeLocal?.split('T')[1]?.slice(0, 5) || 'N/A';

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">{flight.airline?.name || 'Unknown Airline'}</h5>
          <p className="mb-0 text-muted">{flight.number}</p>
          <small>{flight.departure?.airport?.name} → {flight.arrival?.airport?.name}</small>
        </div>
        <div className="text-center">
          <div className="fw-bold">{departureTime}</div>
          <div className="text-muted">→</div>
          <div className="fw-bold">{arrivalTime}</div>
        </div>
        <div className="text-end">
          <h4 className="text-success">₹{flight.price}</h4>
          <button className="btn btn-success btn-sm">BOOK NOW</button>
        </div>
      </div>
    </div>
  );
}

