'use client';

import React, { useState } from 'react';
import AirportSelect from './AirportSelect';

export default function FlightSearchForm({ onSearch }: { onSearch: Function }) {
  const [from, setFrom] = useState<{ label: string; value: string } | null>(null);
  const [to, setTo] = useState<{ label: string; value: string } | null>(null);
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from?.value || !to?.value) return;

    onSearch({ from: from.value, to: to.value, departureDate });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 border rounded mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <AirportSelect label="From" value={from} onChange={setFrom} />
        </div>
        <div className="col-md-4">
          <AirportSelect label="To" value={to} onChange={setTo} />
        </div>
        <div className="col-md-3">
          <label>Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={e => setDepartureDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
