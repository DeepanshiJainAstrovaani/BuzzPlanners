/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import styles from './FlightFilterSidebar.module.css';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)({ color: '#00A859', height: 4 });

export default function TravelPackageFilterSidebar({ filters, setFilters, destinations }: any) {
  const [priceRange, setPriceRange] = React.useState<number[]>(filters.priceRange);

  const handlePriceChange = (_event: any, newValue: number | number[]) => {
    const updated = newValue as number[];
    setPriceRange(updated);
    setFilters((prev: any) => ({
      ...prev,
      priceRange: updated
    }));
  };
  return (
    <div className="bg-white p-4 border rounded-5 shadow col-3">
      <h5 className="mb-3 fw-bold fs-4">FILTER</h5>
      <hr />
      {/* Destinations */}
      <p className="fs-5 fw-medium mb-2">Popular Destination</p>
      {destinations.map((dest: string) => (
        <div key={dest} className="form-check">
          <input
            className={`form-check-input ${styles.form}`}
            type="checkbox"
            id={dest}
            checked={filters.destinations.includes(dest)}
            onChange={e => {
              const checked = e.target.checked;
              setFilters((prev: any) => ({
                ...prev,
                destinations: checked
                  ? [...prev.destinations, dest]
                  : prev.destinations.filter((d: string) => d !== dest)
              }));
            }}
          />
          <label className="form-check-label" htmlFor={dest}>
            {dest}
          </label>
        </div>
      ))}
      <hr />
      {/* Price Range */}
      <p className="fs-5 fw-medium mb-2">Price Range</p>
      <div className="mt-4 px-2">
        <StyledSlider
          value={priceRange}
          onChange={handlePriceChange}
          min={3823}
          max={16882}
          step={100}
          disableSwap
        />
        <div className="text-center mt-2 fw-semibold">
          Rs. {priceRange[0]} – Rs. {priceRange[1]}
        </div>
      </div>
      <hr />
      {/* Accommodation */}
      <p className="fs-5 fw-medium mb-2">Accommodation</p>
      {['5 Star', '4 Star', 'First Class'].map(acc => (
        <div key={acc} className="form-check">
          <input
            className={`form-check-input ${styles.form}`}
            type="checkbox"
            id={acc}
            checked={filters.accommodation.includes(acc)}
            onChange={e => {
              const checked = e.target.checked;
              setFilters((prev: any) => ({
                ...prev,
                accommodation: checked
                  ? [...prev.accommodation, acc]
                  : prev.accommodation.filter((a: string) => a !== acc)
              }));
            }}
          />
          <label className="form-check-label" htmlFor={acc}>
            {acc}
          </label>
        </div>
      ))}
    </div>
  );
}
