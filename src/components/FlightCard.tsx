/* eslint-disable @next/next/no-img-element */

import React from 'react';

export default function FlightCard({ flight }: { flight: any }) {
    const departureTime = flight?.departure?.scheduledTime?.local?.split(' ')[1]?.slice(0, 5) || 'N/A';
    const arrivalTime = flight?.arrival?.scheduledTime?.local?.split(' ')[1]?.slice(0, 5) || 'N/A';

    const departureCity = flight?.departure?.airport?.name?.split(' ')[0] || 'N/A';
    const arrivalCity = flight?.arrival?.airport?.name?.split(' ')[0] || 'N/A';

    // Fake duration for example (you may calculate real one from datetime)
    const duration = '03h 15m';
    const isNonstop = true;

    return (
        <div
            className="card mb-3 border-0 shadow-sm"
            style={{ borderRadius: '1rem', padding: '2% 0 2% 4%' }}
        >
            <div className="d-flex justify-content-between align-items-center">
                {/* Airline + Aircraft Info */}
                <div className='col-3'>
                    <div className="mb-2">
                        <span
                            className="badge rounded-bottom-2 rounded-top-0 fw-lighter mb-2"
                            style={{ 
                                backgroundColor: '#F6EFCE',
                                fontSize: '0.9rem',
                                top: 0,
                                position: 'absolute',
                                color: '#866308'
                             }}
                        >
                            {flight.aircraft?.model || 'Aircraft'}
                        </span>
                    </div>
                    <div>
                        {/* Airline logo placeholder */}
                        <img
                            className='my-3'
                            src={`https://content.airhex.com/content/logos/airlines_${flight.airline?.iata}_200_70_r.png`}
                            alt={`${flight.airline?.name} Logo`}
                            style={{ width: 120, height: 'auto' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/fallback-airline-logo.png';
                            }}
                        />


                        <div>
                            <div className="fw-bold">{flight.airline?.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{flight.number}</div>
                        </div>
                    </div>
                </div>

                {/* Times & Duration */}
                <div className="d-flex align-items-center col-5">
                    <div className="text-center mx-3 col-4">
                        <div className="fw-bold fs-5">{departureTime}</div>
                        <div className="text-muted">{departureCity}</div>
                    </div>

                    {/* Middle Line and Duration */}
                    <div className="text-center px-2 col-4" style={{ width: 100 }}>
                        <div className="small fw-semibold">{duration}</div>
                        <div className="border-top mb-1" />
                        <div className="text-muted small">{isNonstop ? 'Nonstop' : '1 Stop'}</div>
                    </div>

                    <div className="text-center mx-3 col-4">
                        <div className="fw-bold fs-5">{arrivalTime}</div>
                        <div className="text-muted">{arrivalCity}</div>
                    </div>
                </div>

                {/* Price + Button */}
                <div className="text-center col-4">
                    <div className="fw-bold text-danger fs-3 mb-4 mt-2">
                        ₹{flight.price.toLocaleString('en-IN')}
                    </div>
                    <button className="btn btn-success rounded-pill px-4 fw-semibold">
                        BOOK NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
