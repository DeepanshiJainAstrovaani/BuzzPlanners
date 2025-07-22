'use client';

import React, { useState } from 'react';
import { fetchFlightsFromAirport } from '@/api/getFlights';
import FlightCard from '@/components/FlightCard';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightFilterSidebar from '@/components/FlightFilterSidebar';

export default function FlightSearchPage() {
    const [flights, setFlights] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        airlines: ['Air India', 'SpiceJet Airways', 'IndiGo'],
        class: 'Economy',
    });

    const handleSearch = async ({ from, to, departureDate }: any) => {
        const data = await fetchFlightsFromAirport(from, departureDate);
        const allDepartures = data?.departures || [];

        // Dummy price + filtering
        const enriched = allDepartures.map((f: any) => ({
            ...f,
            price: Math.floor(Math.random() * 12000 + 2500), // mock
        }));

        const filtered = enriched.filter((f: any) =>
            filters.airlines.includes(f.airline?.name)
        );

        setFlights(filtered);
    };

    return (
        <div className="d-flex gap-4">
            <FlightFilterSidebar filters={filters} setFilters={setFilters} />
            <div className="flex-grow-1">
                <FlightSearchForm onSearch={handleSearch} />
                <div className="mt-4">
                    {flights.map((flight, index) => (
                        <FlightCard key={index} flight={flight} />
                    ))}
                </div>
            </div>
        </div>
    );
}
