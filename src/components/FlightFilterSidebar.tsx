'use client';

import React from 'react';

export default function FlightFilterSidebar({
  filters,
  setFilters,
  airlines
}: {
  filters: any,
  setFilters: any,
  airlines: string[]
}) {
  return (
    <div className="bg-white p-3 border rounded" style={{ width: '240px' }}>
      <h5 className="mb-3">FILTER</h5>

      <strong>Popular Airlines</strong>
      {airlines.length === 0 && <div className="text-muted">No airlines found</div>}
      {airlines.map((airline) => (
        <div key={airline} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={airline}
            checked={filters.airlines.includes(airline)}
            onChange={e => {
              const checked = e.target.checked;
              setFilters((prev: any) => ({
                ...prev,
                airlines: checked
                  ? [...prev.airlines, airline]
                  : prev.airlines.filter((a: string) => a !== airline)
              }));
            }}
          />
          <label className="form-check-label" htmlFor={airline}>
            {airline}
          </label>
        </div>
      ))}

      <hr />

      <strong>Class</strong>
      {['Economy', 'Business', 'First Class'].map(cls => (
        <div key={cls} className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="class"
            id={cls}
            checked={filters.class === cls}
            onChange={() =>
              setFilters((prev: any) => ({ ...prev, class: cls }))
            }
          />
          <label className="form-check-label" htmlFor={cls}>
            {cls}
          </label>
        </div>
      ))}
    </div>
  );
}
