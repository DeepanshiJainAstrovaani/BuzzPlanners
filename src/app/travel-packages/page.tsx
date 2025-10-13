/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions  */

'use client'; // <<< add this so page is rendered client-side (avoids SSR access to document/window)

import React, { useEffect, useState } from 'react';
// bootstrap JS must be loaded on client only (avoid document during prerender)
import { fetchTravelPackages } from '@/api/getTravelPackages';
import TravelPackageCard from '@/components/TravelPackageCard';
import MobileTravelPackageCard from '@/components/MobileTravelPackageCard';
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
  const [isMobile, setIsMobile] = useState(false);
  
  // load bootstrap JS only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle' as any).catch(() => {});
    }
  }, []);

  const [filters, setFilters] = useState({
    destinations: ['Kasauli'],
    priceRange: [3823, 16882],
    accommodation: ['5 Star', '4 Star'],
  });

  useEffect(() => {
    const m = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener ? m.addEventListener('change', update) : m.addListener(update);
    return () => {
      m.removeEventListener ? m.removeEventListener('change', update) : m.removeListener(update);
    };
  }, []);

  useEffect(() => {
    // Load default packages on mount
    const loadDefaultPackages = async () => {
      const today = new Date().toISOString().split('T')[0];
      const data: any = await fetchTravelPackages('Kasauli', today);
      setPackages(data.packages || []);
    };
    loadDefaultPackages();
  }, []);

  // User-initiated search
  const handleSearch = async ({ destination, date, accommodation, traveller }: any) => {
    setHasSearched(true);
    const data: any = await fetchTravelPackages(destination, date);
    setPackages(data.packages || []);
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
  );

  return (
    <div>
      <Header />
      <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
        {/* --- Search Bar --- */}
        <div className="searchbar-sticky-wrapper py-4 px-5 px-md-5" style={{ background: "#2D3E2E" }}>
          <div className="container">
            <TravelPackageSearchForm onSearch={handleSearch} defaultDest={filters.destinations[0]} />
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
                <TravelPackageFilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  destinations={DEFAULT_DESTINATIONS}
                />
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="d-none d-md-block col-md-3 mb-3">
              <div style={{ position: 'sticky', top: 100 }}>
                <TravelPackageFilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  destinations={DEFAULT_DESTINATIONS}
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
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg, index) => (
                      isMobile ? (
                        <MobileTravelPackageCard key={index} pkg={pkg} />
                      ) : (
                        <TravelPackageCard key={index} pkg={pkg} />
                      )
                    ))
                  ) : (
                    <p>No packages found.</p>
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
