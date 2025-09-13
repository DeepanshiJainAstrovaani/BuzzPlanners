/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useEffect, useState } from 'react';
import { fetchTravelPackages } from '@/api/getTravelPackages';
import TravelPackageCard from '@/components/TravelPackageCard';
import TravelPackageSearchForm from '@/components/TravelPackageSearchForm';
import TravelPackageFilterSidebar from '@/components/TravelPackageFilterSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DEFAULT_DESTINATIONS = [
  'Kasauli', 'Nainital', 'Mukteshwar', 'Rishikesh', 'Manali', 'Dehradun'
];

export default function TravelPackageSearchPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    destinations: ['Kasauli'],
    priceRange: [3823, 16882],
    accommodation: ['5 Star', '4 Star'],
  });

  useEffect(() => {
    // Load default packages on mount
    const loadDefaultPackages = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data: any = await fetchTravelPackages('Kasauli', today);
      setPackages(data.packages);
    };
    loadDefaultPackages();
  }, []);

  // User-initiated search
  const handleSearch = async ({ destination, date, accommodation, traveller }: any) => {
    setHasSearched(true);
    const data: any = await fetchTravelPackages(destination, date);
    setPackages(data.packages);
    setFilters((prev: any) => ({
      ...prev,
      destinations: [destination],
      accommodation,
    }));
  };

  // Filter packages
  const filteredPackages = packages.filter(pkg =>
    (filters.destinations.length === 0 || filters.destinations.includes(pkg.destination)) &&
    pkg.price >= filters.priceRange[0] &&
    pkg.price <= filters.priceRange[1]
    // You can add accommodation and amenities filters here if needed
  );

  return (
    <div>
      <Header />
      <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
        {/* --- Search Bar --- */}
        <div className="searchbar-sticky-wrapper py-4 px-5" style={{ background: "#2D3E2E" }}>
          <div className="container">
            <TravelPackageSearchForm onSearch={handleSearch} defaultDest={filters.destinations[0]} />
          </div>
        </div>

        {/* --- Sidebar + Results --- */}
        <div className="container">
          <div className="d-flex gap-4 align-items-start" style={{ marginTop: 32 }}>
            <TravelPackageFilterSidebar
              filters={filters}
              setFilters={setFilters}
              destinations={DEFAULT_DESTINATIONS}
            />
            <div className="flex-grow-1 hide-scrollbar mb-4" style={{ height: '87rem', overflowY: 'scroll' }}>
              <div className="mt-0">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg, index) => (
                    <TravelPackageCard key={index} pkg={pkg} />
                  ))
                ) : (
                  <p>No packages found.</p>
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
