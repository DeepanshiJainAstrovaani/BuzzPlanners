/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useEffect, useState } from 'react';
import { fetchFlightsFromAirport } from '@/api/getFlights';
import FlightCard from '@/components/FlightCard';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightFilterSidebar from '@/components/FlightFilterSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FlightSearchPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState<{
    airlines: string[]; // user-selected airlines
    priceRange: [number, number];
    class: string;
  }>({
    airlines: [],
    priceRange: [3000, 18000],
    class: 'Economy',
  });

  // 🟢 Load flights on mount
  useEffect(() => {
    const loadDefaultFlights = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data = await fetchFlightsFromAirport('BOM', today);
      const enriched = data?.departures.map((f: any) => ({
        ...f,
        price: Math.floor(Math.random() * 12000 + 2500),
      })) || [];

      setFlights(enriched);

      const airlinesInResults = Array.from(
        new Set(enriched.map((f: any) => f.airline?.name).filter(Boolean))
      );

      setAvailableAirlines(airlinesInResults as string[]);
      setFilters(prev => ({
        ...prev,
        airlines: airlinesInResults // select all initially
      } as any));
    };

    loadDefaultFlights();
  }, []);

  // 🟡 Handle search without resetting selections
  const handleSearch = async ({ from, to, departureDate }: any) => {
    setHasSearched(true);
    const data = await fetchFlightsFromAirport(from, departureDate);
    const enriched = data?.departures.map((f: any) => ({
      ...f,
      price: Math.floor(Math.random() * 12000 + 2500),
    })) || [];

    setFlights(enriched);

    const airlinesInResults = Array.from(
      new Set(enriched.map((f: any) => f.airline?.name).filter(Boolean))
    );

    setAvailableAirlines(airlinesInResults as any);
    // ❌ Don't reset filters.airlines here — keep user's choice
  };

  // 🟣 Apply filters
  const filteredFlights = flights.filter(
    f =>
      (filters.airlines.length === 0 || filters.airlines.includes(f.airline?.name)) &&
      f.price >= filters.priceRange[0] &&
      f.price <= filters.priceRange[1]
  );

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
              airlines={availableAirlines}
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
