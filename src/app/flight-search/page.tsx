'use client';

import React, { useState } from 'react';
import { fetchFlightsFromAirport } from '@/api/getFlights';
import FlightCard from '@/components/FlightCard';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightFilterSidebar from '@/components/FlightFilterSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DEFAULT_AIRLINES = [
    'Air India',
    'SpiceJet Airways',
    'IndiGo',
    'Akasa Air',
    'Air India Express',
    'Batik Air'
];

export default function FlightSearchPage() {
    const [flights, setFlights] = useState<any[]>([]);
    // Used to determine if it's the first search or not
    const [hasSearched, setHasSearched] = useState(false);

    const [filters, setFilters] = useState({
        airlines: DEFAULT_AIRLINES,
        class: 'Economy',
    });

    // Generate dynamic airlines list for sidebar
    const airlinesList =
        flights.length === 0
            ? DEFAULT_AIRLINES
            : Array.from(
                new Set(flights.map(f => f.airline?.name).filter(Boolean))
            );

    const handleSearch = async ({ from, to, departureDate }: any) => {
        setHasSearched(true);
        const data = await fetchFlightsFromAirport(from, departureDate);
        const allDepartures = data?.departures || [];

        // Dummy price + filtering
        const enriched = allDepartures.map((f: any) => ({
            ...f,
            price: Math.floor(Math.random() * 12000 + 2500), // mock
        }));

        setFlights(enriched);

        // Airlines in current results:
        const airlinesInResults: string[] = Array.from(
            new Set(
                enriched
                    .map((f: any) => f.airline?.name)
                    .filter((name: any): name is string => Boolean(name))
            )
        );

        setFilters(prev => {
            if (!hasSearched) {
                // First search: pre-select all airlines found in result
                return {
                    ...prev,
                    airlines: airlinesInResults,
                };
            }
            // Subsequent search: keep only user's previously selected airlines that are still present
            return {
                ...prev,
                airlines: prev.airlines.filter(a => airlinesInResults.includes(a)),
            };
        });
    };

    // Filter flights using user selections
    const filteredFlights = flights.filter(
        f =>
            (filters.airlines.length === 0 ||
                filters.airlines.includes(f.airline?.name)) &&
            // add more filter conditions if needed
            true
    );

    console.log('Filtered Flights:', filteredFlights);
    console.log('Airlines List:', airlinesList);
    console.log('Filters:', filters);

    return (
        <div>
            <Header />
            <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
                {/* --- Top Search Bar --- */}
                <div className="searchbar-sticky-wrapper py-4 px-5" style={{ background: "#2D3E2E" }}>
                    <div
                        className="container px-0"
                        style={{
                            maxWidth: '100%'
                        }}
                    >
                        <FlightSearchForm onSearch={handleSearch} />
                    </div>
                </div>

                {/* --- Main Content (Sidebar + Results) --- */}
                <div className="container px-5" style={{ maxWidth: '100%' }}>
                    <div className="d-flex gap-4 align-items-start" style={{ marginTop: 32 }}>
                        <FlightFilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            airlines={airlinesList}
                        />
                        <div className="flex-grow-1">
                            <div className="mt-0"> {/* No margin needed now; already spaced */}
                                {filteredFlights.map((flight, index) => (
                                    <FlightCard key={index} flight={flight} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
