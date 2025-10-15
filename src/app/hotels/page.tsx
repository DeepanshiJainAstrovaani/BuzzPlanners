'use client';

import React, { useEffect, useState } from 'react';
import HotelCard from '@/components/HotelCard';
import MobileHotelCard from '@/components/MobileHotelCard';
import HotelSearchForm from '@/components/HotelSearchForm';
import HotelFilterSidebar from '@/components/HotelFilterSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock hotel data matching the design
const MOCK_HOTELS = [
  {
    id: '1',
    name: 'Hotel 414 Luxury Stay Near Mall Road',
    location: 'Mall Road',
    distance: '0.5 km drive from Mall Road',
    rating: 4.5,
    reviews: 1250,
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    amenities: ['Couple Friendly', 'Only 2 Rooms Left'],
    images: ['/images/stay1.png', '/images/stay2.jpg', '/images/stay3.jpg'],
    star: 4
  },
  {
    id: '2',
    name: 'Hotel 414 Luxury Stay Near Mall Road',
    location: 'Mall Road',
    distance: '0.5 km drive from Mall Road',
    rating: 4.5,
    reviews: 890,
    price: 4600,
    originalPrice: 5500,
    discount: 16,
    amenities: ['Couple Friendly'],
    images: ['/images/stay2.jpg', '/images/stay3.jpg', '/images/stay4.jpg'],
    star: 4
  },
  {
    id: '3',
    name: 'Hotel 414 Luxury Stay Near Mall Road',
    location: 'Mall Road',
    distance: '0.5 km drive from Mall Road',
    rating: 4.5,
    reviews: 654,
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    amenities: ['Couple Friendly', 'Only 2 Rooms Left'],
    images: ['/images/stay3.jpg', '/images/stay4.jpg', '/images/stay5.jpg'],
    star: 4
  },
  {
    id: '4',
    name: 'Hotel 414 Luxury Stay Near Mall Road',
    location: 'Mall Road',
    distance: '0.5 km drive from Mall Road',
    rating: 4.5,
    reviews: 432,
    price: 4600,
    originalPrice: 5500,
    discount: 16,
    amenities: ['Couple Friendly'],
    images: ['/images/stay4.jpg', '/images/stay5.jpg', '/images/stay1.png'],
    star: 4
  }
];

export default function HotelSearchPage() {
  const [hotels, setHotels] = useState<any[]>(MOCK_HOTELS);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Load bootstrap JS only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle' as any).catch(() => {});
    }
  }, []);

  const [filters, setFilters] = useState({
    destinations: ['Nainital'],
    priceRange: [1000, 10000],
    starRating: ['4 Star', '5 Star'],
    amenities: [],
  });

  const [sortBy, setSortBy] = useState('price-low-high');

  useEffect(() => {
    const m = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener ? m.addEventListener('change', update) : m.addListener(update);
    return () => {
      m.removeEventListener ? m.removeEventListener('change', update) : m.removeListener(update);
    };
  }, []);

  // User-initiated search
  const handleSearch = async (searchParams: any) => {
    setHasSearched(true);
    // In a real app, this would fetch from an API
    setHotels(MOCK_HOTELS);
    setFilters((prev: any) => ({
      ...prev,
      destinations: [searchParams.destination],
    }));
  };

  // Filter and sort hotels based on current filters and sorting
  const filteredAndSortedHotels = React.useMemo(() => {
    // First filter hotels
    let filtered = hotels.filter(hotel => {
      // Price filter
      if (hotel.price < filters.priceRange[0] || hotel.price > filters.priceRange[1]) {
        return false;
      }
      
      // Star rating filter
      if (filters.starRating.length > 0) {
        const hotelStarLabel = `${hotel.star} Star`;
        if (!filters.starRating.includes(hotelStarLabel)) {
          return false;
        }
      }

      // Destination filter
      if (filters.destinations.length > 0) {
        // For now, all mock hotels are in the same location, so we'll show them if destination matches
        // In a real app, you'd check if hotel.location matches any of the selected destinations
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasMatchingAmenity = filters.amenities.some((amenity: string) => 
          hotel.amenities.some((hotelAmenity: string) => 
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasMatchingAmenity) {
          return false;
        }
      }
      
      return true;
    });

    // Then sort the filtered results
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  }, [hotels, filters, sortBy]);

  return (
    <div>
      <Header />
      <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
        {/* Search Bar */}
        <div className="searchbar-sticky-wrapper py-4 px-5 px-md-5" style={{ background: "#2D3E2E" }}>
          <div className="container">
            <HotelSearchForm onSearch={handleSearch} defaultDest={filters.destinations[0]} />
          </div>
        </div>

        {/* Sidebar + Results */}
        <div className='container'>
          <div className="px-md-5" style={{ marginTop: 'clamp(16px, 4vw, 24px)' }}>
            <div className="row p-0" style={{ padding: '0 clamp(8px, 2vw, 16px)' }}>
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
              </div>

              {/* Filter Sidebar */}
              <div className="col-md-3">
                <div className="collapse d-md-block mb-4 mb-md-0" id="mobileFilters">
                  <HotelFilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    destinations={['Nainital', 'Kasauli', 'Mukteshwar', 'Rishikesh', 'Manali', 'Dehradun']}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    {filteredAndSortedHotels.length} Hotels Found
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">Sort by:</small>
                    <select 
                      className="form-select form-select-sm" 
                      style={{ width: 'auto' }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="reviews">Most Reviewed</option>
                    </select>
                  </div>
                </div>

                {filteredAndSortedHotels.length === 0 ? (
                  <div className="text-center py-5">
                    <h6 className="text-muted">No hotels found matching your criteria</h6>
                    <p className="text-muted">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="hotel-results">
                    {filteredAndSortedHotels.map((hotel: any, index: number) => (
                      <div key={hotel.id} className="mb-4">
                        {isMobile ? (
                          <MobileHotelCard hotel={hotel} />
                        ) : (
                          <HotelCard hotel={hotel} />
                        )}
                      </div>
                    ))}
                  </div>
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
