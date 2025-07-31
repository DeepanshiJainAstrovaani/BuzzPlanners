'use client';

import React, { useEffect, useState } from 'react';
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
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    airlines: DEFAULT_AIRLINES,
    priceRange: [3000, 18000],
    class: 'Economy',
  });

  // 🟢 Load default flights (e.g., from BOM today) on mount
  useEffect(() => {
    const loadDefaultFlights = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data = await fetchFlightsFromAirport('BOM', today); // Default: Mumbai
      const allDepartures = data?.departures || [];

      const enriched = allDepartures.map((f: any) => ({
        ...f,
        price: Math.floor(Math.random() * 12000 + 2500),
      }));

      setFlights(enriched);

      const airlinesInResults: string[] = Array.from(
        new Set(enriched.map((f: any) => f.airline?.name).filter(Boolean))
      );

      setFilters(prev => ({
        ...prev,
        airlines: airlinesInResults,
      }));
    };

    loadDefaultFlights();
  }, []);

  // 🟡 Handle user-initiated search
  const handleSearch = async ({ from, to, departureDate }: any) => {
    setHasSearched(true);
    const data = await fetchFlightsFromAirport(from, departureDate);
    const allDepartures = data?.departures || [];

    const enriched = allDepartures.map((f: any) => ({
      ...f,
      price: Math.floor(Math.random() * 12000 + 2500),
    }));

    setFlights(enriched);

    const airlinesInResults: string[] = Array.from(
      new Set(enriched.map((f: any) => f.airline?.name).filter(Boolean))
    );

    setFilters(prev => ({
      ...prev,
      airlines: airlinesInResults,
    }));
  };

  // 🟣 Filter flights
  const filteredFlights = flights.filter(
    f =>
      (filters.airlines.length === 0 || filters.airlines.includes(f.airline?.name)) &&
      f.price >= filters.priceRange[0] &&
      f.price <= filters.priceRange[1]
  );

  const airlinesList =
    flights.length === 0
      ? DEFAULT_AIRLINES
      : Array.from(new Set(flights.map(f => f.airline?.name).filter(Boolean)));

  return (
    <div>
      <Header />
      <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
        {/* --- Search Bar --- */}
        <div className="searchbar-sticky-wrapper py-4 px-5" style={{ background: "#2D3E2E" }}>
          <div className="container">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>

        {/* --- Sidebar + Results --- */}
        <div className="container">
          <div className="d-flex gap-4 align-items-start" style={{ marginTop: 32 }}>
            <FlightFilterSidebar
              filters={filters}
              setFilters={setFilters}
              airlines={airlinesList}
            />
            <div className="flex-grow-1 hide-scrollbar mb-4" style={{ height: '87rem', overflowY: 'scroll' }}>
              <div className="mt-0">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight, index) => (
                    <FlightCard key={index} flight={flight} />
                  ))
                ) : (
                  <p>No flights found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
