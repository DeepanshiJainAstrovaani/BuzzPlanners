/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions  */

'use client';

import React, { useEffect, useState } from 'react';
// bootstrap JS must be loaded only on the client – import it dynamically in useEffect below
import { fetchFlightsFromAirport } from '@/api/getFlights';
import FlightCard from '@/components/FlightCard';
import MobileFlightCard from '@/components/MobileFlightCard';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightFilterSidebar from '@/components/FlightFilterSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FlightSearchPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [filters, setFilters] = useState<{
    airlines: string[]; // user-selected airlines
    priceRange: [number, number];
    class: string;
  }>({
    airlines: [],
    priceRange: [3000, 18000],
    class: 'Economy',
  });

  // load bootstrap JS only on client to avoid server-side "document is not defined"
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle' as any).catch(() => {});
    }
  }, []);

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

  useEffect(() => {
    const m = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener ? m.addEventListener('change', update) : m.addListener(update);
    return () => {
      m.removeEventListener ? m.removeEventListener('change', update) : m.removeListener(update);
    };
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
        <div className="searchbar-sticky-wrapper py-4 px-5 px-md-5" style={{ background: "#2D3E2E" }}>
          <div className="container">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>

        {/* --- Sidebar + Results --- */}
        <div className="container" style={{ marginTop: 32 }}>
          <div className="row px-md-5">
            {/* Mobile filter toggle */}
            <div className="col-12 d-md-none mb-3">
              <button
                className="btn btn-outline-secondary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mobileFilters"
                aria-expanded="false"
                aria-controls="mobileFilters"
              >
                Filters
              </button>
              <div className="collapse mt-3" id="mobileFilters">
                <FlightFilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  airlines={availableAirlines}
                />
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="d-none d-md-block col-md-3 mb-3">
              <div style={{ position: 'sticky', top: 100 }}>
                <FlightFilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  airlines={availableAirlines}
                />
              </div>
            </div>

            {/* Results */}
            <div className="col-12 col-md-9">
              <div
                className="flex-grow-1 hide-scrollbar mb-4"
                style={{
                  height: isMobile ? 'auto' : '50rem',
                  overflowY: 'auto',
                  paddingBottom: isMobile ? 24 : undefined
                }}
              >
                <div className="mt-0">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight, index) => (
                      isMobile ? (
                        <MobileFlightCard key={index} flight={flight} />
                      ) : (
                        <FlightCard key={index} flight={flight} />
                      )
                    ))
                  ) : (
                    <p>No flights found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
