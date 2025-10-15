import React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)({
    color: '#24a86b',
    height: 4,
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(36, 168, 107, 0.16)',
        },
        '&.Mui-active': {
            boxShadow: '0 0 0 14px rgba(36, 168, 107, 0.16)',
        },
    },
    '& .MuiSlider-track': {
        height: 4,
    },
    '& .MuiSlider-rail': {
        color: '#d8d8d8',
        opacity: 1,
        height: 4,
    },
});

// Custom green checkbox styles
const checkboxStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    cursor: 'pointer'
  },
  checkbox: {
    appearance: 'none' as const,
    width: '16px',
    height: '16px',
    border: '2px solid #ddd',
    borderRadius: '3px',
    marginRight: '8px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white'
  },
  checkboxChecked: {
    backgroundColor: '#24a86b',
    borderColor: '#24a86b'
  },
  checkboxAfter: {
    content: '""',
    position: 'absolute' as const,
    left: '4px',
    top: '1px',
    width: '4px',
    height: '8px',
    border: 'solid white',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
    opacity: 1
  },
  label: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
    userSelect: 'none' as const
  }
};

export default function HotelFilterSidebar({ filters, setFilters, destinations }: any) {
  const sectionStyle: React.CSSProperties = { marginBottom: 20 };

  const [priceRange, setPriceRange] = React.useState<number[]>([filters.priceRange[0], filters.priceRange[1]]);

  // Sync local state with filters when they change
  React.useEffect(() => {
    setPriceRange([filters.priceRange[0], filters.priceRange[1]]);
  }, [filters.priceRange]);

  const handlePriceChange = (_event: any, newValue: number | number[]) => {
    const updated = newValue as number[];
    setPriceRange(updated);
    setFilters((prev: any) => ({
      ...prev,
      priceRange: updated
    }));
  };

  const handleDestinationChange = (destination: string) => {
    setFilters((prev: any) => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter((d: string) => d !== destination)
        : [...prev.destinations, destination]
    }));
  };

  const handleStarRatingChange = (star: string) => {
    setFilters((prev: any) => ({
      ...prev,
      starRating: prev.starRating.includes(star)
        ? prev.starRating.filter((s: string) => s !== star)
        : [...prev.starRating, star]
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFilters((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div
      className="card border-0 shadow-sm p-4 pb-4 pb-md-4"
      style={{
        borderRadius: '12px',
        position: 'sticky',
        top: '20px',
        height: 'fit-content',
        marginBottom: '24px'
      }}
    >
      <h6 className="mb-4" style={{ fontWeight: 600, color: '#333' }}>
        FILTER
      </h6>

      {/* Popular Places */}
      <div style={sectionStyle}>
        <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
          Popular Places
        </h6>
        {destinations.map((place: string) => (
          <div 
            key={place} 
            style={checkboxStyles.container}
            onClick={() => handleDestinationChange(place)}
          >
            <div 
              style={{
                ...checkboxStyles.checkbox,
                ...(filters.destinations.includes(place) ? checkboxStyles.checkboxChecked : {})
              }}
            >
              {filters.destinations.includes(place) && (
                <div style={checkboxStyles.checkboxAfter} />
              )}
            </div>
            <label style={checkboxStyles.label}>
              {place}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div style={sectionStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: 0 }}>
            Ticket Price
          </h6>
          <span style={{ fontSize: '12px', color: '#666' }}>
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </span>
        </div>
        <StyledSlider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="off"
          min={500}
          max={15000}
          step={500}
        />
      </div>

      {/* Hotels (Star Rating) */}
      <div style={sectionStyle}>
        <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
          Hotels
        </h6>
        {['5 Star', '4 Star', '3 Star'].map((star: string) => (
          <div 
            key={star} 
            style={checkboxStyles.container}
            onClick={() => handleStarRatingChange(star)}
          >
            <div 
              style={{
                ...checkboxStyles.checkbox,
                ...(filters.starRating.includes(star) ? checkboxStyles.checkboxChecked : {})
              }}
            >
              {filters.starRating.includes(star) && (
                <div style={checkboxStyles.checkboxAfter} />
              )}
            </div>
            <label style={{...checkboxStyles.label, display: 'flex', alignItems: 'center'}}>
              <span style={{ marginRight: '4px' }}>⭐</span>
              {star}
            </label>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div style={sectionStyle}>
        <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
          Amenities
        </h6>
        {[
          'Free WiFi',
          'Swimming Pool',
          'Gym/Fitness Center',
          'Restaurant',
          'Room Service',
          'Air Conditioning',
          'Parking',
          'Pet Friendly',
          'Couple Friendly'
        ].map((amenity: string) => (
          <div 
            key={amenity} 
            style={checkboxStyles.container}
            onClick={() => handleAmenityChange(amenity)}
          >
            <div 
              style={{
                ...checkboxStyles.checkbox,
                ...(filters.amenities.includes(amenity) ? checkboxStyles.checkboxChecked : {})
              }}
            >
              {filters.amenities.includes(amenity) && (
                <div style={checkboxStyles.checkboxAfter} />
              )}
            </div>
            <label style={checkboxStyles.label}>
              {amenity}
            </label>
          </div>
        ))}
      </div>

      {/* Clear Filters Button */}
      <button
        className="btn btn-outline-secondary w-100"
        style={{
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          padding: '8px 16px'
        }}
        onClick={() => {
          setFilters({
            destinations: [],
            priceRange: [500, 15000],
            starRating: [],
            amenities: []
          });
        }}
      >
        Clear All Filters
      </button>
    </div>
  );
}
